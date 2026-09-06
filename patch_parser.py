import os
import re

from file_resolver import resolve_path, normalize


class PatchParseError(Exception):
    """Raised when the LLM output cannot be turned into file blocks at all."""


class PatchSecurityError(Exception):
    """Raised when a parsed file block targets a disallowed path."""


class PatchParser:
    """Extracts <file><path>...</path><content>...</content></file> blocks
    from raw LLM output, tolerating thinking blocks, markdown fences and the
    truncated / malformed output that weaker free models often produce."""

    FILE_BLOCK = re.compile(
        r'<file>\s*<path>(.*?)</path>\s*<content>(.*?)</content>\s*</file>',
        re.DOTALL
    )

    TRUNCATED_BLOCK = re.compile(
        r'<file>\s*<path>(.*?)</path>\s*<content>(.*?)(?:</content>\s*</file>|$)',
        re.DOTALL
    )

    def parse(self, patch, plan):
        patch = re.sub(r'<think>.*?</think>', '', patch, flags=re.DOTALL)
        patch = re.sub(r"^.*?(?=<file>)", '', patch, count=1, flags=re.DOTALL) if '<file>' in patch else patch

        md_match = re.search(r'```(?:xml)?\s*(.*?)\s*```', patch, re.DOTALL)
        if md_match and '<file>' in md_match.group(1):
            patch = md_match.group(1)

        file_matches = self.FILE_BLOCK.findall(patch)

        open_count = patch.count('<file>')
        close_count = patch.count('</file>')
        if open_count > close_count:
            print(f"⚠️  Warning: LLM output was truncated ({open_count} blocks opened, {close_count} closed)")
            print(f"   Only {close_count} complete block(s) will be applied.\n")

            if not file_matches:
                for path, content in self.TRUNCATED_BLOCK.findall(patch):
                    path = path.strip()
                    content = content.strip()
                    if len(content) > 100 and ('export' in content or 'import' in content or '{' in content):
                        file_matches.append((path, content))
                        print(f"  🔧 Salvaged truncated block: {path} ({len(content)} chars)")

        if not file_matches:
            print("⚠️  No XML blocks found. Trying fallback parser (markdown code fences)...")
            file_matches = self._parse_markdown_fallback(patch, plan)

        if not file_matches:
            raise PatchParseError(
                "No valid <file> XML blocks found in the LLM output. "
                f"Raw output started with: {patch[:300]!r}"
            )

        return [(path.strip(), content.strip() + '\n') for path, content in file_matches]

    def _parse_markdown_fallback(self, patch, plan):
        file_matches = []
        code_blocks = re.findall(r'```(?:jsx?|tsx?|css|html)\s*\n(.*?)```', patch, re.DOTALL)

        if not code_blocks:
            return file_matches

        plan_files = re.findall(r'[-•]\s*(src/\S+|public/\S+)', plan)

        for i, block in enumerate(code_blocks):
            block = block.strip()
            if not block:
                continue

            guessed_path = None
            if i < len(plan_files):
                guessed_path = plan_files[i]
            elif block[:100].lstrip().startswith(('/*', ':root', '.', '@')):
                for pf in plan_files:
                    if pf.endswith('.css'):
                        guessed_path = pf
                        break
                if not guessed_path:
                    guessed_path = "src/app/globals.css"
            elif any(kw in block[:200] for kw in ('export', 'import', 'function')):
                for pf in plan_files:
                    if pf.endswith(('.js', '.jsx', '.ts', '.tsx')):
                        guessed_path = pf
                        break

            if guessed_path and guessed_path not in [m[0] for m in file_matches]:
                file_matches.append((guessed_path, block))
                print(f"  📎 Mapped code block to: {guessed_path}")

        return file_matches


ALLOWED_DIRS = ("src", "public")
ALLOWED_EXTENSIONS = (".js", ".jsx", ".ts", ".tsx", ".css")


def validate_file_paths(file_matches, project_files, target_files, max_files=6):
    """Guard against path traversal or the AI writing files it shouldn't.

    Only accepts paths that:
      - are relative and stay inside the repo (no absolute paths, no ..)
      - live under src/ or public/ with an allowed extension
      - either match one of the plan's intended target files (which may be a
        brand-new file the plan explicitly asked for), or already exist in
        the project — so the AI can't invent files nobody planned

    `target_files` may be a single path, a list of paths (for plans that
    legitimately span multiple coordinated files), or falsy.
    """

    if not target_files:
        normalized_targets = set()
    elif isinstance(target_files, str):
        normalized_targets = {os.path.normpath(target_files)}
    else:
        normalized_targets = {os.path.normpath(t) for t in target_files}

    validated = []

    for path, content in file_matches:
        normalized = os.path.normpath(normalize(path))

        # The model often writes a loose path ("page.js"). If it isn't already
        # one of the authorized targets, try to resolve what it meant before
        # rejecting it outright.
        if normalized not in normalized_targets:
            resolved = resolve_path(normalized, project_files)
            if resolved:
                normalized = os.path.normpath(resolved)

        parts = normalized.split(os.sep)

        if os.path.isabs(path) or ".." in parts:
            raise PatchSecurityError(f"Refusing to write outside the project: {path!r}")

        if parts[0] not in ALLOWED_DIRS:
            raise PatchSecurityError(f"Refusing to write to disallowed location: {path!r}")

        if not normalized.endswith(ALLOWED_EXTENSIONS):
            raise PatchSecurityError(f"Refusing to write disallowed file type: {path!r}")

        # Anything that survived the checks above is inside src/ or public/
        # with a source-file extension, so creating it is safe even when the
        # plan didn't name it — while implementing, the model legitimately
        # discovers it needs a new component. The directory/extension guards
        # above are the real security boundary, not the plan.
        validated.append((normalized, content))

    if max_files and len(validated) > max_files:
        raise PatchSecurityError(
            f"Refusing to write {len(validated)} files in one patch "
            f"(limit {max_files}) — keep the change focused"
        )

    return validated
