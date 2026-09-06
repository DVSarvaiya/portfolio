"""Maps loose file references from LLM output onto real project files.

Free models rarely write a clean, exact path. They write "page.js", or
"the landing page", or a path with a stray backtick. Rejecting the plan
for that is what produced the "no existing project file was referenced"
dead end — so instead we resolve what they meant, and when they name
nothing usable we search the project for the files the feedback is about.
"""

import os

ALLOWED_DIRS = ("src", "public")
ALLOWED_EXTENSIONS = (".js", ".jsx", ".ts", ".tsx", ".css")

# Keyword -> file, used to recover target files straight from the feedback
# when a plan names none. Ordered most-specific first.
FEEDBACK_HINTS = [
    (
        ("colour", "color", "palette", "theme", "dark mode", "light mode", "font",
         "background", "gradient", "animation", "keyframe", "css", "styling",
         "scrollbar", "shadow", "glass"),
        "src/app/globals.css",
    ),
    (
        ("layout", "metadata", "page title", "favicon", "<head>", "html tag",
         "body tag", "wrapper", "flash"),
        "src/app/layout.js",
    ),
    (
        ("hero", "landing", "page", "section", "nav", "navbar", "menu", "button",
         "card", "project", "skill", "contact", "form", "footer", "cursor",
         "toggle", "design", "layout of", "responsive", "mobile", "scroll",
         "typing", "particle", "lag", "smooth", "performance"),
        "src/app/page.js",
    ),
]

# Used when the feedback matches nothing at all — better than doing nothing.
DEFAULT_TARGETS = ("src/app/page.js", "src/app/globals.css")


def normalize(candidate):
    """Strip the punctuation/quoting LLMs wrap around paths."""
    if not candidate:
        return ""
    text = str(candidate).strip().strip("`\"'*").rstrip(".,:;)")
    return text.replace("\\", "/").lstrip("./")


def resolve_path(candidate, project_files):
    """Best-effort map of an LLM-written path onto a real project file.

    Returns the real path, or None if nothing in the project matches.
    """
    normalized = normalize(candidate)
    if not normalized:
        return None

    if normalized in project_files:
        return normalized

    lowered = {path.lower(): path for path in project_files}
    if normalized.lower() in lowered:
        return lowered[normalized.lower()]

    # "app/page.js" -> "src/app/page.js"
    for path in project_files:
        if path.lower().endswith("/" + normalized.lower()):
            return path

    # Bare basename: "page.js" -> "src/app/page.js"
    base = os.path.basename(normalized).lower()
    matches = [p for p in project_files if os.path.basename(p).lower() == base]
    if len(matches) == 1:
        return matches[0]
    for match in matches:
        if match.startswith("src/app/"):
            return match

    return matches[0] if matches else None


def is_creatable(candidate):
    """True if this path is one the agent may create as a brand-new file."""
    normalized = normalize(candidate)
    if not normalized or normalized.startswith("/"):
        return False

    parts = normalized.split("/")
    if ".." in parts or parts[0] not in ALLOWED_DIRS:
        return False

    return normalized.endswith(ALLOWED_EXTENSIONS)


def infer_files(feedback, project_files, limit=2):
    """Search the project for the files this feedback is most likely about.

    This is the recovery path when a plan names no usable file: rather than
    telling the user "I couldn't do anything", we pick the files the words
    point at and let the developer stage work against those.
    """
    text = (feedback or "").lower()
    scores = {}

    for keywords, path in FEEDBACK_HINTS:
        if path not in project_files:
            continue
        hits = sum(1 for keyword in keywords if keyword in text)
        if hits:
            scores[path] = scores.get(path, 0) + hits

    ranked = [path for path, _ in sorted(scores.items(), key=lambda kv: kv[1], reverse=True)]

    for fallback in DEFAULT_TARGETS:
        if fallback in project_files and fallback not in ranked:
            ranked.append(fallback)

    return ranked[:limit]
