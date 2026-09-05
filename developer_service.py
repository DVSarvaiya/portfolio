import re


class DeveloperService:

    @staticmethod
    def resolve_target_files(plan):
        """Pull the exact file paths the planner listed under
        "FILES TO MODIFY", instead of guessing from a hardcoded shortlist.
        This is what lets a plan legitimately span 2-3 coordinated files
        (e.g. a theme toggle needs the layout, the CSS variables, and the
        component) instead of being forced into a single file."""

        match = re.search(
            r'FILE(?:S)?\s+TO\s+MODIFY:\s*\n((?:\s*[-•]\s+.+\n?)+)',
            plan,
            re.IGNORECASE
        )
        block = match.group(1) if match else plan

        paths = re.findall(r'[-•]\s*(src/[^\s:]+|public/[^\s:]+)', block)

        seen = []
        for path in paths:
            path = path.rstrip('.,:;')
            if path not in seen:
                seen.append(path)

        return seen[:3]

    def generate_patch(
        self,
        ai,
        context,
        previous_error=None
    ):
        plan = context["plan"]
        target_files = self.resolve_target_files(plan)
        multi_file = len(target_files) > 1

        block_instruction = (
            f"Output EXACTLY {len(target_files)} <file> blocks, one for each of these files "
            f"(and no others): {', '.join(target_files)}."
            if target_files else
            "Output EXACTLY ONE <file> block."
        )

        system_prompt = f"""You are an expert Next.js + Tailwind CSS engineer who writes clean, polished, production-quality UI code — never generic or half-finished.

CRITICAL: Your ENTIRE response must be ONLY {"one or more" if multi_file else "one"} XML <file> block(s). No thinking, no explanation, no markdown.

FORMAT (repeat the <file> block once per file being changed):

<file>
<path>src/app/page.js</path>
<content>
// complete file content here
</content>
</file>

RULES:
1. Start your response IMMEDIATELY with <file> — no text before it.
2. {block_instruction}
3. Each <content> MUST contain the file's COMPLETE new content (not a diff, not a snippet with "// ... rest unchanged").
4. Do NOT wrap output in markdown code fences (no ```).
5. Do NOT include any thinking, analysis, or explanation.
6. Do NOT import packages that are not in package.json (no framer-motion, no three.js, no lucide-react, no react-icons).
7. Only use: react, react-dom, next (these are the installed packages).
8. Do NOT create or reference files that don't exist and weren't listed above.
9. Preserve all existing working functionality that the plan doesn't ask you to change.

QUALITY BAR (weak/generic output is a failure condition, not just "good enough"):
- If you're touching an interactive element, it must be FULLY wired: state, event handler, visual feedback (hover/focus/active), and an accessible label. A button that renders but does nothing is not acceptable.
- If the plan spans multiple files (e.g. a toggle needing layout + CSS + component), every file must agree on the same mechanism (same class name, same CSS variable names, same state values) — half-wiring one file and leaving another stale is the most common failure mode; do not do this.
- Reuse the project's existing CSS variables (--primary, --accent, --muted, --background, --foreground, --border, --card, --glass-bg, --surface-soft/medium/strong) instead of introducing new hardcoded hex colors, so the change stays visually consistent and theme-aware.
- Use the existing spacing/radius/shadow conventions already present in the file you're editing (e.g. rounded-xl/2xl for cards, rounded-full for pills, existing gap/padding scale) rather than inventing new ad hoc values.
- No dead code, no leftover console.log, no unused variables/imports, no commented-out blocks.

TAILWIND CSS v4 RULES (CRITICAL — builds WILL fail if you violate these):
- This project uses Tailwind CSS v4 with @import "tailwindcss" in globals.css.
- NEVER use @apply with Tailwind utility classes in CSS files. This causes build errors.
- Use Tailwind classes directly in JSX className attributes instead.
- In globals.css, write plain CSS only (no @apply, no @screen, no theme() function).
- You CAN use @theme inline {{ }} blocks for CSS custom properties.
- You CAN use CSS custom properties (var(--xxx)) in globals.css and as Tailwind arbitrary values like bg-[var(--card)].
- Dark mode is class-based: `.dark` on <html> switches the CSS variables (see @custom-variant dark in globals.css). Prefer variable-driven styling over `dark:` utility variants unless you're deliberately setting a one-off value that shouldn't come from a shared variable.
"""

        prompt = "Execution Plan\n\n"
        prompt += plan
        prompt += f"\n\nIMPORTANT: {block_instruction}\n"
        prompt += "\n\nProject Files (current content)\n\n"

        for path, content in context["project"].items():
            # Only include relevant files to reduce token usage
            if path.startswith("src/") or path == "package.json":
                prompt += f"--- {path} ---\n{content}\n\n"

        prompt += f"RESPOND WITH {block_instruction} Start with <file> immediately.\n"
        prompt += "REMEMBER: No @apply in CSS. No importing packages not in package.json. Fully wire any interactive element you touch.\n"

        if previous_error:
            prompt += (
                "\n\nIMPORTANT: Your previous attempt failed with this error. "
                f"Fix the issue and respond again with {block_instruction}\n"
                f"{previous_error}\n"
            )

        result = ai.ask(prompt, system_prompt=system_prompt, max_tokens=24576)

        # Validate: check if result contains proper XML blocks
        if "<file>" in result and "<path>" in result and "<content>" in result:
            return result

        # Output is malformed — attempt a repair pass
        print("⚠️ LLM output missing XML blocks. Attempting repair...")

        repair_prompt = f"""The following code output needs to be wrapped in the correct XML format.

Wrap it in this EXACT format (repeat once per file, and nothing else):

<file>
<path>FILEPATH</path>
<content>
FULL FILE CONTENT
</content>
</file>

{block_instruction} No other text.

Here is the raw code output to wrap:
{result[:12000]}

Respond with ONLY the <file> XML block(s). No other text."""

        return ai.ask(
            repair_prompt,
            system_prompt="You convert code into XML file blocks. Output ONLY <file> block(s), nothing else.",
            max_tokens=24576
        )
