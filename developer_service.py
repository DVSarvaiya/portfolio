class DeveloperService:

    def generate_patch(self, ai, context, target_files, previous_error=None):
        project = context["project"]
        plan = context["plan"]

        existing = [path for path in target_files if path in project]
        new_files = [path for path in target_files if path not in project]

        block_instruction = (
            f"Output EXACTLY {len(target_files)} <file> block(s), one per file, "
            f"for these paths and no others: {', '.join(target_files)}."
        )

        system_prompt = f"""You are an expert Next.js + Tailwind CSS v4 engineer. You write complete, working, polished code — never scaffolding, never placeholders.

Your ENTIRE response is <file> blocks and nothing else:

<file>
<path>src/app/page.js</path>
<content>
...the complete file...
</content>
</file>

HARD RULES:
1. Start immediately with <file>. No preamble, no explanation, no markdown fences.
2. {block_instruction}
3. Each <content> is the COMPLETE final file. Never a diff, never "// ...rest unchanged", never a fragment.
4. Only react, react-dom, next are installed. No framer-motion, three.js, lucide-react, react-icons, or any other package. Icons must be inline <svg>.
5. Keep every existing feature that the plan doesn't explicitly change.

NEVER SHIP EMPTY OR PLACEHOLDER CONTENT:
- Any section that needs data gets realistic hardcoded data written directly into the file: real-sounding project names, one-or-two-sentence descriptions, tech tags, dates, numbers, links.
- Banned: empty arrays awaiting data, "Lorem ipsum", "TODO", "Coming soon", "Project One"/"Project Two", "Your text here", empty href="#" on a link that should go somewhere real.
- If you genuinely have no real value (e.g. a live GitHub URL), use a plausible concrete one rather than a blank.

FULLY WIRE WHAT YOU TOUCH:
- An interactive element needs its state, its handler, a visible hover/focus state, and an aria-label. A button that renders but does nothing is a failed response.
- When several files are in one response they must agree exactly: same class names, same CSS variable names, same prop names, same state values. Half-wiring one file and leaving another stale is the most common failure — do not do it.
- A new component file must be imported and actually rendered by the file that uses it, in this same response.

STYLE:
- Reuse the project's existing CSS variables (--primary, --accent, --muted, --background, --foreground, --border, --card, --glass-bg) instead of new hardcoded hex colors, so changes stay theme-aware in both light and dark mode.
- Match the spacing, radius and shadow conventions already in the file you're editing.
- Prefer CSS transitions/keyframes over JS-driven animation, and avoid per-mousemove React state updates — they cause visible lag.
- No dead code, no console.log, no unused imports or variables.

TAILWIND v4 (builds FAIL if you break these):
- Never use @apply, @screen, or theme() in CSS.
- globals.css is plain CSS plus @theme inline {{ }} blocks and CSS custom properties.
- Dark mode is class-based via `.dark` on <html> (@custom-variant dark). Style through the CSS variables so both themes work.
- Tailwind arbitrary values may reference variables, e.g. bg-[var(--card)].
"""

        prompt = f"Execution plan\n\n{plan}\n\n{block_instruction}\n\n"

        if new_files:
            prompt += (
                "These files DO NOT EXIST yet — create them from scratch, complete "
                f"and self-contained: {', '.join(new_files)}\n\n"
            )

        prompt += "Current content of the files you are editing:\n\n"
        for path in existing:
            prompt += f"--- {path} ---\n{project[path]}\n\n"

        # Supporting context the model needs to stay consistent, but must not edit.
        prompt += "Reference only (do NOT output these as <file> blocks):\n\n"
        for path, content in project.items():
            if path in target_files:
                continue
            if path.startswith("src/") or path == "package.json":
                prompt += f"--- {path} ---\n{content}\n\n"

        prompt += f"{block_instruction} Start with <file> immediately.\n"
        prompt += "Remember: complete files, real hardcoded data, everything fully wired, no @apply.\n"

        if previous_error:
            prompt += (
                "\nYOUR PREVIOUS ATTEMPT FAILED. Fix this and try again:\n"
                f"{previous_error}\n"
            )

        result = ai.ask(prompt, system_prompt=system_prompt, max_tokens=24576)

        if "<file>" in result and "<path>" in result and "<content>" in result:
            return result

        print("⚠️ LLM output missing XML blocks. Attempting repair...")

        repair_prompt = f"""Rewrap the following code into this exact format, once per file:

<file>
<path>FILEPATH</path>
<content>
FULL FILE CONTENT
</content>
</file>

{block_instruction} No other text.

Raw output to rewrap:
{result[:12000]}"""

        return ai.ask(
            repair_prompt,
            system_prompt="You convert code into <file> XML blocks. Output only <file> blocks.",
            max_tokens=24576,
        )
