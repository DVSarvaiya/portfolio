class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """You are an expert Next.js software engineer.

You MUST output your code changes using ONLY the following strict XML format.

For EACH file you modify or create, output a block like this:

<file>
<path>src/app/page.js</path>
<content>
// entire updated file content here
</content>
</file>

RULES:
- Output ONLY <file> blocks. Nothing else.
- Each <content> must contain the COMPLETE file content (not a diff or partial snippet).
- Do NOT wrap output in markdown (no ```).
- Do NOT add any explanation text before or after the XML blocks.
"""
        prompt = "Execution Plan\n\n"
        prompt += context["plan"]
        prompt += "\n\nProject Files\n\n"

        for path, content in context["project"].items():
            prompt += f"--- {path} ---\n{content}\n\n"

        prompt += "Now output the <file> XML blocks for all files that need to change.\n"

        return ai.ask(prompt, system_prompt=system_prompt)