class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """
You are an expert Next.js software engineer.

You must output your code changes using the following strict XML format for EACH file you modify or create:

<file>
<path>src/app/page.js</path>
<content>
// Full updated file content goes here
</content>
</file>

Return ONLY the XML blocks. Do not explain. Do not use markdown wrappers.
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