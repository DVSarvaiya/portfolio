import re


class DeveloperService:

    def generate_patch(
        self,
        ai,
        context
    ):
        system_prompt = """You are an expert Next.js software engineer.

CRITICAL: Your ENTIRE response must be ONLY ONE XML file block. No thinking, no explanation, no markdown.

FORMAT (follow EXACTLY):

<file>
<path>src/app/page.js</path>
<content>
// complete file content here
</content>
</file>

RULES:
1. Start your response IMMEDIATELY with <file> — no text before it.
2. Output EXACTLY ONE <file> block. Never output more than one file.
3. The <content> MUST contain the COMPLETE file content (not a diff).
4. Do NOT wrap output in markdown code fences (no ```).
5. Do NOT include any thinking, analysis, or explanation.
6. Do NOT import packages that are not in package.json (no framer-motion, no three.js, no lucide-react, no react-icons).
7. Only use: react, react-dom, next (these are the installed packages).
8. Do NOT create references to files that don't exist.
9. Keep changes focused — implement only what the plan asks for.
10. Preserve existing working functionality.

TAILWIND CSS v4 RULES (CRITICAL — builds WILL fail if you violate these):
- This project uses Tailwind CSS v4 with @import "tailwindcss" in globals.css.
- NEVER use @apply with Tailwind utility classes in CSS files. This causes build errors.
- Use Tailwind classes directly in JSX className attributes instead.
- In globals.css, write plain CSS only (no @apply, no @screen, no theme() function).
- You CAN use @theme inline { } blocks for CSS custom properties.
- You CAN use CSS custom properties (var(--xxx)) in globals.css.
"""
        # Determine which single file to modify based on the plan
        plan = context["plan"]
        target_file = None

        # Priority: page.js > globals.css > layout.js
        plan_lower = plan.lower()
        if "page.js" in plan_lower or "page.js" in plan:
            target_file = "src/app/page.js"
        elif "globals.css" in plan_lower or "globals.css" in plan:
            target_file = "src/app/globals.css"
        elif "layout.js" in plan_lower or "layout.js" in plan:
            target_file = "src/app/layout.js"

        prompt = "Execution Plan\n\n"
        prompt += plan
        prompt += "\n\nIMPORTANT: Output EXACTLY ONE <file> block."
        if target_file:
            prompt += f" Modify ONLY: {target_file}\n"
        prompt += "\n\nProject Files (current content)\n\n"

        for path, content in context["project"].items():
            # Only include relevant files to reduce token usage
            if path.startswith("src/") or path == "package.json":
                prompt += f"--- {path} ---\n{content}\n\n"

        prompt += "RESPOND WITH EXACTLY ONE <file> XML BLOCK. Start with <file> immediately.\n"
        prompt += "REMEMBER: No @apply in CSS. No importing packages not in package.json.\n"

        result = ai.ask(prompt, system_prompt=system_prompt)

        # Validate: check if result contains proper XML blocks
        if "<file>" in result and "<path>" in result and "<content>" in result:
            return result

        # Output is malformed — attempt a repair pass
        print("⚠️ LLM output missing XML blocks. Attempting repair...")

        repair_prompt = f"""The following code output needs to be wrapped in the correct XML format.

Wrap it in this EXACT format (and nothing else):

<file>
<path>FILEPATH</path>
<content>
FULL FILE CONTENT
</content>
</file>

Output EXACTLY ONE <file> block. No other text.

Here is the raw code output to wrap:
{result[:8000]}

Respond with ONLY the <file> XML block. No other text."""

        return ai.ask(repair_prompt, system_prompt="You convert code into XML file blocks. Output ONLY ONE <file> block, nothing else.")