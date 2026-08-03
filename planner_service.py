class PlannerService:

    def build_plan(self, ai, context):
        system_prompt = """You are a Senior Software Architect planning code changes for a Next.js portfolio website.

You receive feedback from the user and a list of files in the project. Your job is to create a specific, actionable plan that a developer can follow to implement the requested changes.

You MUST respond with a plan in this exact format:

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
"""

        file_list = "\\n".join(f"- {path}" for path in context["project"].keys())

        planning_prompt = f"""Here is the user's feedback:

{context["feedback"]}

Here are the files in the project:
{file_list}

Create a specific plan to implement the feedback. Focus on modifying existing files only."""

        return ai.ask(
            planning_prompt,
            system_prompt=system_prompt
        )