class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """You are an expert Next.js software engineer.

You MUST output your code changes using ONLY the following strict XML format.

For EACH file you modify, output a block like this:

<file>
<path>src/app/page.js</path>
<content>
// entire updated file content here
</content>
</file>

STRICT RULES:
1. Output ONLY <file> blocks. Nothing else. No explanation.
2. Each <content> MUST contain the COMPLETE file content.
3. Do NOT wrap output in markdown (no ```).
4. Do NOT import modules or components that do not already exist in the project.
5. Do NOT create references to new files unless you ALSO provide that file as another <file> block.
6. Keep changes MINIMAL. Only change what the plan asks for.
7. Preserve all existing imports, structure, and styling unless the plan specifically says to change them.
8. Modify AT MOST 2 files to keep the output short and avoid truncation.
"""
        prompt = "Execution Plan\n\n"
        prompt += context["plan"]
        prompt += "\n\nProject Files (current content)\n\n"

        for path, content in context["project"].items():
            prompt += f"--- {path} ---\n{content}\n\n"

        prompt += "Now output the <file> XML blocks for the files that need to change. Remember: ONLY modify existing files, keep changes minimal, and do NOT reference components or modules that don't exist in the project.\n"

        return ai.ask(prompt, system_prompt=system_prompt)