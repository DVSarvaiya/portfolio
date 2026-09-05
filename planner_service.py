import re

MAX_PLAN_FILES = 3


class PlannerService:

    def build_plan(self, ai, context):
        system_prompt = """You are a Senior Frontend Architect + Designer planning code changes for a Next.js portfolio website. You are opinionated about quality and never ship a bland, half-implemented change.

CRITICAL: Output ONLY the plan. No thinking, no analysis, no reasoning. Start your response with "GOAL:" immediately.

You MUST respond in this EXACT format and nothing else:

GOAL: [one sentence describing what needs to change]

FILES TO MODIFY:
- [filepath]: [what to change in this file]
- [filepath]: [what to change in this file]   (only if this feature genuinely requires more than one file)

DETAILS:
[3-5 sentences with concrete implementation detail: exact colors/spacing/behavior, not vague adjectives like "improve" or "enhance".]

RULES ABOUT SCOPE:
- List the MINIMUM number of files a *complete, working* version of this feature needs — usually 1, up to a maximum of 3.
- A feature that touches shared state or global appearance (e.g. a theme toggle, a global font change, a layout-wide nav) genuinely needs multiple coordinated files — list all of them rather than shipping a button with no wiring behind it. A change scoped to one section (e.g. restyle the projects grid) needs only 1 file.
- Only reference files that exist in the project file list below.
- Do NOT suggest creating new component files — only modify existing ones.

RULES ABOUT QUALITY (this is what separates a good plan from a lazy one):
- Be concrete: name exact Tailwind utility classes, exact copy text, exact spacing/sizes — not "make it nicer".
- If the feedback is vague (e.g. "make it better"), you must still produce ONE specific, well-scoped improvement — do not describe multiple vague options.
- Prefer changes that use the project's existing design tokens (CSS variables like --primary, --accent, --muted, --background, --foreground, --border, --card, --glass-bg, --surface-soft/medium/strong) over introducing new hardcoded colors, so the result stays consistent with the rest of the site and with dark/light theming.
- Every interactive element must have a real hover/focus state and an accessible label — a plan that adds a button with no visual feedback state is incomplete.
- Never propose a change that is purely cosmetic scaffolding with no behavior (e.g. a toggle/button that doesn't actually do anything) — if it's interactive, its full behavior must be part of the plan.

RULES ABOUT STACK:
- Do NOT suggest installing new npm packages. Only use: react, react-dom, next, tailwindcss.
- Do NOT suggest framer-motion, three.js, lucide-react, react-icons, or any other package.
- Use plain CSS and inline styles/CSS keyframes for animations, not external animation libraries.
- This project uses Tailwind CSS v4. NEVER use @apply in CSS files — it causes build errors.
- Do NOT output any thinking, reasoning, or analysis before the plan.
"""

        file_list = "\\n".join(f"- {path}" for path in context["project"].keys())

        planning_prompt = f"""Here is the user's feedback:

{context["feedback"]}

Here are the files in the project:
{file_list}

Create a specific, high-quality plan to implement the feedback. Focus on modifying existing files only.
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
        details_match = re.search(r'DETAILS:\s*\n((?:.+\n?){1,8})', result, re.IGNORECASE)

        # If we found structured sections, reconstruct a clean plan
        if goal_match and file_match:
            goal = goal_match.group(1).strip().rstrip('"').strip()
            # If the goal is garbage (too short or just punctuation), use a generic one
            if len(goal) < 10 or not any(c.isalpha() for c in goal):
                goal = "Improve the portfolio UI based on user feedback"

            # Cap at MAX_PLAN_FILES bullet lines so a runaway model can't
            # turn this into a repo-wide rewrite.
            file_lines = [line for line in file_match.group(1).strip().splitlines() if line.strip()]
            files = "\n".join(file_lines[:MAX_PLAN_FILES])
            details = details_match.group(1).strip() if details_match else "Implement the changes described above."

            result = f"GOAL: {goal}\n\nFILES TO MODIFY:\n{files}\n\nDETAILS:\n{details}"
        else:
            # Fallback: try to extract from "GOAL:" but limit to first 500 chars
            goal_pos = result.find("GOAL:")
            if goal_pos >= 0:
                result = result[goal_pos:goal_pos + 500]
            else:
                # Last resort: generate a minimal plan
                result = f"""GOAL: Improve the portfolio UI based on user feedback

FILES TO MODIFY:
- src/app/page.js: Update the page component based on user feedback

DETAILS:
Implement the user's requested changes to src/app/page.js while preserving existing functionality."""

        return result.strip()
