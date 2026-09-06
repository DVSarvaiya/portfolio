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

    # Anything with a directory in it that matched nothing above is a NEW
    # file, not a typo for an existing one. This matters enormously in the
    # App Router, where every route file is called page.js: falling back to
    # basename matching here would resolve a brand-new "src/app/about/page.js"
    # onto the existing home page and overwrite it.
    if "/" in normalized:
        return None

    # Bare basename only ("page.js", "globals.css")
    base = normalized.lower()
    matches = [p for p in project_files if os.path.basename(p).lower() == base]
    if len(matches) == 1:
        return matches[0]
    for match in matches:
        if match.startswith("src/app/"):
            return match

    return matches[0] if matches else None


def repair_new_path(candidate):
    """Normalize a new-file path the model wrote loosely.

    Models write "about/page.js" or "app/about/page.js" when they mean
    "src/app/about/page.js". Returns a creatable path, or None.
    """
    normalized = normalize(candidate)
    if not normalized:
        return None

    # src/app/ first: everything in this project lives there, and a route
    # ("about/page.js") is only a real route under src/app.
    for attempt in (normalized, f"src/app/{normalized}", f"src/{normalized}"):
        if is_creatable(attempt):
            return attempt

    return None


def suggest_route(feedback):
    """If the request asks for a whole new page/route, propose where it goes.

    A new App Router route is a directory with a page.js inside it, which a
    weak model routinely gets wrong — so we hand it the correct path.
    """
    text = (feedback or "").lower()

    triggers = ("new page", "separate page", "different page", "another page",
                "new route", "route for", "dedicated page", "own page", "make page")
    if not any(trigger in text for trigger in triggers):
        return None

    for name in ("about", "projects", "skills", "contact", "blog", "resume",
                 "experience", "work"):
        if name in text:
            return f"src/app/{name}/page.js"

    return "src/app/about/page.js"


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

    # A request for a whole new page needs a route file that doesn't exist
    # yet — put it first, and keep page.js alongside it so the nav gets linked.
    route = suggest_route(feedback)
    if route and route not in project_files:
        ranked = [route] + [p for p in ranked if p != route]
        if "src/app/page.js" in project_files and "src/app/page.js" not in ranked:
            ranked.append("src/app/page.js")
        limit = max(limit, 2)

    for fallback in DEFAULT_TARGETS:
        if fallback in project_files and fallback not in ranked:
            ranked.append(fallback)

    return ranked[:limit]
