class PlannerService:

    def build_plan(self, ai, context):
        system_prompt = "You are a Senior Software Architect."

        planning_prompt = f"""

Today's feedback

{context["feedback"]}

Project

{list(context["project"].keys())}

Return

Goal

Files

Reasoning

Risks

"""

        return ai.ask(
            planning_prompt,
            system_prompt=system_prompt
        )