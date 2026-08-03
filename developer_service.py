class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """
You are an expert Next.js software engineer.

Return ONLY a unified git patch.

Never explain.

Never use markdown.

Never wrap inside ```.

Output must begin with:

diff --git
"""
        prompt = f"""

Execution Plan

{context["plan"]}

Relevant Files

"""

        for path in context["project"]:

            if path in context["plan"]:

                prompt += f"""

FILE

{path}

{context["project"][path]}

"""

        return ai.ask(prompt, system_prompt=system_prompt)