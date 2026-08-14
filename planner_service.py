import re


class PlannerService:

    def build_plan(self, ai, context):
        system_prompt = """You are a Senior Software Architect planning code changes for a Next.js portfolio website.

CRITICAL: Output ONLY the plan. No thinking, no analysis, no reasoning. Start your response with "GOAL:" immediately.

You MUST respond in this EXACT format and nothing else:

GOAL: [one sentence describing what needs to change]

FILE TO MODIFY:
- [ONE filepath]: [what to change in this file]

DETAILS:
[2-3 sentences explaining the specific code changes needed]

RULES:
- Modify EXACTLY ONE file per plan. Pick the most important file to change.
- Only reference files that exist in the project file list.
- Be specific about what code to add, remove, or change.
- Keep changes minimal and focused on the feedback.
- Do NOT suggest installing new npm packages. Only use: react, react-dom, next, tailwindcss.
- Do NOT suggest framer-motion, three.js, lucide-react, react-icons, or any other package.
- Use plain CSS and inline styles for animations, not external animation libraries.
- This project uses Tailwind CSS v4. NEVER use @apply in CSS files — it causes build errors.
- Do NOT suggest creating new component files.
- Do NOT output any thinking, reasoning, or analysis before the plan.
"""

        file_list = "\\n".join(f"- {path}" for path in context["project"].keys())

        planning_prompt = f"""Here is the user's feedback:

{context["feedback"]}

Here are the files in the project:
{file_list}

Create a specific plan to implement the feedback. Focus on modifying existing files only.
Start your response with "GOAL:" immediately. No thinking or analysis."""

        result = ai.ask(
            planning_prompt,
            system_prompt=system_prompt,
            max_tokens=1024
        )

        # Strip thinking blocks that free models often prepend
        result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL)
        result = re.sub(r"(?i)^.*?here'?s?\s+(a\s+)?thinking.*?:\s*", '', result, flags=re.DOTALL)

        # Extract structured sections individually instead of taking everything after GOAL:
        goal_match = re.search(r'GOAL:\s*(.+?)(?:\n|$)', result)
        file_match = re.search(r'FILE(?:S)?\s+TO\s+MODIFY:\s*\n((?:\s*-\s+.+\n?)+)', result, re.IGNORECASE)
        details_match = re.search(r'DETAILS:\s*\n((?:.+\n?){1,5})', result, re.IGNORECASE)

        # If we found structured sections, reconstruct a clean plan
        if goal_match and file_match:
            goal = goal_match.group(1).strip().rstrip('"').strip()
            # If the goal is garbage (too short or just punctuation), use a generic one
            if len(goal) < 10 or not any(c.isalpha() for c in goal):
                goal = "Improve the portfolio UI based on user feedback"
            
            files = file_match.group(1).strip()
            details = details_match.group(1).strip() if details_match else "Implement the changes described above."
            
            result = f"GOAL: {goal}\n\nFILE TO MODIFY:\n{files}\n\nDETAILS:\n{details}"
        else:
            # Fallback: try to extract from "GOAL:" but limit to first 500 chars
            goal_pos = result.find("GOAL:")
            if goal_pos >= 0:
                result = result[goal_pos:goal_pos + 500]
            else:
                # Last resort: generate a minimal plan
                result = f"""GOAL: Improve the portfolio UI based on user feedback

FILE TO MODIFY:
- src/app/page.js: Update the page component based on user feedback

DETAILS:
Implement the user's requested changes to src/app/page.js while preserving existing functionality."""

        return result.strip()