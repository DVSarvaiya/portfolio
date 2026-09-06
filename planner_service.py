import re

from file_resolver import resolve_path, repair_new_path, normalize

MAX_PLAN_FILES = 4

# Phrases that mean the model echoed the template back instead of writing a
# plan. This is the exact failure that produced a "GOAL:" followed by the
# rule list, so it's checked explicitly rather than hoped away.
META_MARKERS = (
    "[filepath]",
    "[sentence]",
    "[one sentence",
    "[what to change",
    "[2-3 sentences",
    "[3-5 sentences",
    "exactly one file per plan",
    "files to modify:\n- [",
    "do not output any thinking",
    "no new npm packages",
    "start your response with",
)

# A path with any number of leading folders, or a bare filename.
# The folders matter: "about/page.js" and "page.js" are completely different
# files in the App Router, so the pattern must not swallow the directory.
PATH_PATTERN = re.compile(
    r'((?:[\w.-]+/)*[\w.-]+\.(?:js|jsx|ts|tsx|css))',
    re.IGNORECASE,
)


class PlannerService:

    def build_plan(self, ai, context, previous_error=None):
        system_prompt = """You are a senior frontend engineer planning ONE concrete change to a Next.js + Tailwind CSS v4 portfolio site.

Reply with ONLY a plan in this shape. Never repeat these instructions back.

GOAL: Replace the mouse-follow glow in the hero with a static CSS gradient so the page stops stuttering.

FILES TO MODIFY:
- src/app/page.js: delete the mousePos state, its mousemove effect, and the glow div; add a static gradient div
- src/app/globals.css: add a .hero-glow class with a radial-gradient using var(--primary)

DETAILS:
Remove the useState/useEffect pair that tracks the cursor and the absolutely positioned div that follows it. Replace it with a single fixed div using the new .hero-glow class so nothing re-renders on mouse movement.

That is the exact shape of a correct answer. Now write one for the real request.

RULES:
- Name real files. Use full paths from the file list you are given (e.g. src/app/page.js), never placeholders.
- List 1 to 4 files — as many as a COMPLETE working change needs, no more. A change to one section needs 1 file. Anything global (theming, a shared component, a nav used everywhere) needs the files that make it actually work.
- You MAY and SHOULD create new files when the request calls for one. If you do, also list the existing file that will import or link to it — a new file nothing references is dead code.
- CREATING A NEW PAGE/ROUTE (Next.js App Router, file-system routing): a route is a FOLDER containing a page.js. A page at /about is the file src/app/about/page.js, exporting a default React component. Never put a second page in src/app/page.js — that file is the home page ("/") and must not be replaced by the new page. Linking to it means a <Link href="/about"> from next/link in src/app/page.js.
  So "give X its own page" is at minimum two files:
  - src/app/x/page.js (new)
  - src/app/page.js (change that nav item to a <Link href="/x">)
- If the request needs content (projects, skills, stats, testimonials, posts), say that realistic hardcoded data must be written into the file. Never plan for empty arrays or "Coming soon" placeholders.
- Be concrete: name the actual elements, classes and values to change, not "improve the design".
- Only use react, react-dom, next, tailwindcss. No new npm packages, no icon libraries, no animation libraries.
- Tailwind v4: never use @apply. Plain CSS or utility classes only.
- Output only GOAL / FILES TO MODIFY / DETAILS. No preamble, no reasoning, no markdown fences.
"""

        file_list = "\n".join(f"- {path}" for path in context["project"].keys())

        planning_prompt = f"""Request from the site owner:

{context["feedback"]}

Files that exist in this project (use these exact paths):
{file_list}

Write the plan now, starting with "GOAL:"."""

        if previous_error:
            planning_prompt += (
                f"\n\nYour previous attempt was rejected: {previous_error}\n"
                "Write a new plan that fixes that problem. Name real file paths "
                "from the list above."
            )

        result = ai.ask(
            planning_prompt,
            system_prompt=system_prompt,
            max_tokens=1024
        )

        # Strip thinking blocks that free models often prepend
        result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL)
        result = re.sub(r"(?i)^.*?here'?s?\s+(a\s+)?thinking.*?:\s*", '', result, flags=re.DOTALL)

        goal_match = re.search(r'GOAL:\s*(.+?)(?:\n|$)', result)
        file_match = re.search(
            r'FILE(?:S)?\s+TO\s+MODIFY:\s*\n((?:\s*[-•*]\s+.+\n?)+)',
            result,
            re.IGNORECASE,
        )
        details_match = re.search(r'DETAILS:\s*\n((?:.+\n?){1,8})', result, re.IGNORECASE)

        if goal_match and file_match:
            goal = goal_match.group(1).strip().rstrip('"').strip()
            if len(goal) < 10 or not any(c.isalpha() for c in goal):
                goal = "Improve the portfolio based on the site owner's feedback"

            file_lines = [line for line in file_match.group(1).strip().splitlines() if line.strip()]
            files = "\n".join(file_lines[:MAX_PLAN_FILES])
            details = details_match.group(1).strip() if details_match else "Implement the change described above."

            return f"GOAL: {goal}\n\nFILES TO MODIFY:\n{files}\n\nDETAILS:\n{details}".strip()

        goal_pos = result.find("GOAL:")
        if goal_pos >= 0:
            return result[goal_pos:goal_pos + 800].strip()

        return result.strip()


def synthesize_plan(feedback, target_files):
    """Build a usable plan deterministically when the model can't.

    Better than exiting: we already know which files the feedback points at,
    so hand the developer stage a concrete instruction built from them.
    """
    file_lines = "\n".join(
        f"- {path}: apply the site owner's requested change to this file"
        for path in target_files
    )

    return (
        f"GOAL: Apply the site owner's requested change: {feedback.strip()[:180]}\n\n"
        f"FILES TO MODIFY:\n{file_lines}\n\n"
        f"DETAILS:\n{feedback.strip()[:600]}\n"
        "Implement this fully and keep all existing working functionality intact."
    )


def validate_plan(plan, project_files):
    """Turn a raw plan into a concrete list of target files.

    Returns (target_files, error). Loose references ("page.js") are resolved
    against the real project; brand-new files are allowed when the path is
    somewhere the agent is permitted to write.
    """
    text = (plan or "").strip()

    if len(text) < 40:
        return [], "the plan was too short to act on"

    lowered = text.lower()
    if any(marker in lowered for marker in META_MARKERS):
        return [], (
            "the plan repeated the instruction template instead of naming a real "
            "change (do not echo the rules back — write an actual GOAL and real file paths)"
        )

    section = re.search(
        r'FILE(?:S)?\s+TO\s+MODIFY:\s*\n((?:\s*[-•*]\s+.+\n?)+)',
        text,
        re.IGNORECASE,
    )
    search_area = section.group(1) if section else text

    candidates = PATH_PATTERN.findall(search_area)
    if not candidates and section:
        candidates = PATH_PATTERN.findall(text)

    target_files = []
    unresolved = []

    for candidate in candidates:
        resolved = resolve_path(candidate, project_files)

        if not resolved:
            # Not an existing file — treat it as one to create, repairing
            # loose forms like "about/page.js" into "src/app/about/page.js".
            resolved = repair_new_path(candidate)

        if resolved:
            if resolved not in target_files:
                target_files.append(resolved)
        else:
            unresolved.append(candidate)

    if not target_files:
        detail = f" (could not match: {', '.join(unresolved[:3])})" if unresolved else ""
        return [], f"the plan named no file that exists in this project{detail}"

    return target_files[:MAX_PLAN_FILES], None
