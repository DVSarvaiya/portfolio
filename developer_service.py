import re


class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """You are an expert Next.js software engineer.

CRITICAL: Your ENTIRE response must be ONLY XML file blocks. No thinking, no explanation, no markdown.

FORMAT (follow EXACTLY):

<file>
<path>src/app/page.js</path>
<content>
// complete file content here
</content>
</file>

<file>
<path>src/app/globals.css</path>
<content>
/* complete file content here */
</content>
</file>

RULES:
1. Start your response IMMEDIATELY with <file> — no text before it.
2. Each <content> MUST contain the COMPLETE file content (not a diff).
3. Do NOT wrap output in markdown code fences (no ```).
4. Do NOT include any thinking, analysis, or explanation.
5. Do NOT import modules or components that do not already exist.
6. Do NOT create references to new files unless you ALSO provide that file.
7. Keep changes MINIMAL. Only change what the plan asks for.
8. Preserve all existing imports, structure, and styling unless the plan says otherwise.
9. Modify AT MOST 2 files to keep output short and avoid truncation.
"""
        prompt = "Execution Plan\n\n"
        prompt += context["plan"]
        prompt += "\n\nProject Files (current content)\n\n"

        for path, content in context["project"].items():
            prompt += f"--- {path} ---\n{content}\n\n"

        prompt += "RESPOND WITH ONLY <file> XML BLOCKS. Start your response with <file> immediately.\n"

        result = ai.ask(prompt, system_prompt=system_prompt)

        # Validate: check if result contains proper XML blocks
        if "<file>" in result and "<path>" in result and "<content>" in result:
            return result

        # Output is malformed — attempt a repair pass
        print("⚠️ LLM output missing XML blocks. Attempting repair...")

        repair_prompt = f"""The following code output needs to be wrapped in the correct XML format.

Wrap each file in this EXACT format (and nothing else):

<file>
<path>FILEPATH</path>
<content>
FULL FILE CONTENT
</content>
</file>

The plan said to modify these files:
{context["plan"]}

Here is the raw code output to wrap:
{result[:6000]}

Respond with ONLY the <file> XML blocks. No other text."""

        return ai.ask(repair_prompt, system_prompt="You convert code into XML file blocks. Output ONLY <file> blocks, nothing else.")