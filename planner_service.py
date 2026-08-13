import re


class PlannerService:

    def build_plan(self, ai, context):
        system_prompt = """You are a Senior Software Architect planning code changes for a Next.js portfolio website.

CRITICAL: Output ONLY the plan. No thinking, no analysis, no reasoning. Start your response with "GOAL:" immediately.

You MUST respond in this EXACT format and nothing else:

GOAL: [one sentence describing what needs to change]

FILES TO MODIFY:
- [filepath]: [what to change in this file]
- [filepath]: [what to change in this file]

DETAILS:
[2-3 sentences explaining the specific code changes needed]

RULES:
- Only reference files that exist in the project file list.
- Be specific about what code to add, remove, or change.
- Keep changes minimal and focused on the feedback.
- Do NOT suggest creating new component files unless absolutely necessary.
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

        # Extract from "GOAL:" onwards if there's preamble
        goal_match = re.search(r'(GOAL:.*)', result, re.DOTALL)
        if goal_match:
            result = goal_match.group(1)

        return result.strip()