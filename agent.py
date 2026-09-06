import os
import re
import traceback
from datetime import datetime, timezone

from dotenv import load_dotenv

from agent_core.github_service import GitHubService
from agent_core.ai_service import AIService
from agent_core.file_manager import FileManager
from agent_core.feedback_service import FeedbackService
from agent_core.execution_context import ExecutionContext
from agent_core.agent_runner import AgentRunner, DEFAULT_MAX_ITERATIONS
from agent_core.git_service import GitService

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv()

GH_TOKEN = os.getenv("GH_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
REPOSITORY = os.getenv("GITHUB_REPOSITORY")
MODEL = os.getenv("OPENROUTER_MODEL", "z-ai/glm-5.2:free")
MAX_ITERATIONS = int(os.getenv("AGENT_MAX_ITERATIONS", DEFAULT_MAX_ITERATIONS))

if not GH_TOKEN:
    raise Exception("Missing GH_TOKEN")

if not OPENROUTER_API_KEY:
    raise Exception("Missing OPENROUTER_API_KEY")

if not REPOSITORY:
    raise Exception("Missing GITHUB_REPOSITORY")

# ==========================================================
# GitHub
# ==========================================================

github_service = GitHubService(GH_TOKEN, REPOSITORY)
repo = github_service.get_repo()

print("✅ GitHub Connected")
print(f"Repository: {repo.full_name}")

# ==========================================================
# AI
# ==========================================================

ai = AIService(OPENROUTER_API_KEY, MODEL)

print("✅ OpenRouter Connected")

# ==========================================================
# Read Project
# ==========================================================

files = FileManager()
project = files.collect_project_files()

print(f"✅ Loaded {len(project)} project files")

# ==========================================================
# Read Feedback
# ==========================================================

feedback_service = FeedbackService(repo)

result = feedback_service.get_latest_feedback()

feedback = result["feedback"]
issue = result["issue"]
comment = result["comment"]

if feedback:
    print("✅ Feedback Loaded")
else:
    print("ℹ️ No new feedback found")
    print("🎉 Agent Exiting Gracefully")
    exit(0)


def today():
    return datetime.now(timezone.utc).strftime("%d %b %Y")


def plan_section(plan, header):
    """Pull one section (GOAL / DETAILS) out of the plan text."""
    if not plan:
        return ""
    match = re.search(
        rf'{header}:\s*(.+?)(?:\n\s*\n|\Z)',
        plan,
        re.IGNORECASE | re.DOTALL,
    )
    return match.group(1).strip() if match else ""


def quoted(text, limit=280):
    snippet = " ".join(text.split())[:limit]
    return f"> {snippet}{'…' if len(text) > limit else ''}"


def fail(message, run=None, mark_processed=False):
    """Report a failure to the issue and exit non-zero."""
    print(f"\n❌ {message}\n")

    body = [
        f"## ⚠️ Daily Update — {today()}",
        "",
        "**Status:** could not ship a change",
        "",
        "**Your request**",
        quoted(feedback),
        "",
        "**What went wrong**",
        message,
    ]

    if run and run.history:
        attempts = "\n".join(f"- {line}" for line in run.history[-10:])
        body += ["", f"**What I tried ({run.iterations} iteration(s))**", attempts]

    feedback_service.report(issue, "\n".join(body))

    if mark_processed:
        feedback_service.mark_processed(comment)

    exit(1)


try:
    # ==========================================================
    # Build Execution Context
    # ==========================================================

    context = ExecutionContext()
    context.set_feedback(feedback)
    context.set_project(project)

    # ==========================================================
    # Iterate until the build passes (or the budget runs out)
    # ==========================================================

    runner = AgentRunner(ai, context, max_iterations=MAX_ITERATIONS)
    run = runner.run()

    if run.status != "ready":
        fail(
            f"I ran {run.iterations} iterations without producing a change that builds. "
            f"Last error:\n\n```\n{(run.error or 'unknown')[-1200:]}\n```",
            run=run,
            mark_processed=True,
        )

    print("✅ Build Successful")

    # ==========================================================
    # Commit
    # ==========================================================

    git = GitService()
    committed, git_error = git.commit("Daily Portfolio Improvement")

    if git_error:
        # Good, building code that never reached the remote — leave the
        # comment unprocessed so this feedback is retried as-is next run.
        fail(f"the change built successfully but could not be pushed.\n\n```\n{git_error}\n```", run=run)

    if not committed:
        feedback_service.report(
            issue,
            f"## ℹ️ Daily Update — {today()}\n\n"
            f"**Your request**\n{quoted(feedback)}\n\n"
            "I produced a change for this, but it came out identical to what's "
            "already on the site — nothing to commit."
        )
        feedback_service.mark_processed(comment)
        print("🎉 Agent Finished — nothing to commit")
        exit(0)

    print("✅ Changes Committed")

    # ==========================================================
    # Report back
    # ==========================================================

    sha = os.popen("git rev-parse HEAD").read().strip()[:7]
    goal = plan_section(run.plan, "GOAL") or "Applied the requested change"
    details = plan_section(run.plan, "DETAILS")

    changed = [
        f"- `{path}`{' — **new file**' if path not in project else ''}"
        for path, _ in run.files
    ]

    body = [
        f"## ✅ Daily Update — {today()}",
        "",
        "**Your request**",
        quoted(feedback),
        "",
        "**What I changed**",
        goal,
        "",
        "**Files updated**",
        "\n".join(changed),
    ]

    if details:
        body += ["", "**How**", details]

    body += [
        "",
        "---",
        f"Build ✅ passed · {run.iterations} iteration(s) · commit "
        f"[`{sha}`](https://github.com/{repo.full_name}/commit/{sha})",
    ]

    feedback_service.report(issue, "\n".join(body))
    feedback_service.mark_processed(comment)

    print("\n🎉 Agent Finished Successfully")

except Exception as e:
    # Guarantee the user finds out something broke, even on an unexpected
    # crash, instead of only seeing a red X in the Actions tab.
    print(traceback.format_exc())
    feedback_service.report(
        issue,
        f"## ⚠️ Daily Update — {today()}\n\n"
        f"The run crashed unexpectedly: `{e}`\n\nCheck the Actions log for details."
    )
    exit(1)
