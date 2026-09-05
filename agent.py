import os
import shutil
import traceback

from dotenv import load_dotenv

from github_service import GitHubService
from ai_service import AIService
from file_manager import FileManager
from feedback_service import FeedbackService
from execution_context import ExecutionContext
from planner_service import PlannerService
from developer_service import DeveloperService
from validator import Validator
from git_service import GitService
from patch_parser import PatchParser, PatchParseError, PatchSecurityError, validate_file_paths

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv()

GH_TOKEN = os.getenv("GH_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
REPOSITORY = os.getenv("GITHUB_REPOSITORY")
MODEL = os.getenv("OPENROUTER_MODEL", "z-ai/glm-5.2:free")

MAX_PATCH_ATTEMPTS = 3

if not GH_TOKEN:
    raise Exception("Missing GH_TOKEN")

if not OPENROUTER_API_KEY:
    raise Exception("Missing OPENROUTER_API_KEY")

if not REPOSITORY:
    raise Exception("Missing GITHUB_REPOSITORY")

# ==========================================================
# GitHub
# ==========================================================

github_service = GitHubService(
    GH_TOKEN,
    REPOSITORY
)

repo = github_service.get_repo()

print("✅ GitHub Connected")
print(f"Repository: {repo.full_name}")

# ==========================================================
# AI
# ==========================================================

ai = AIService(
    OPENROUTER_API_KEY,
    MODEL
)

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


def fail(message, mark_comment_processed=False):
    """Report a failure back to the issue (so it's visible without digging
    through Actions logs) and exit with a non-zero status."""
    print(f"\n❌ {message}\n")
    feedback_service.report(issue, f"⚠️ Daily update failed: {message}")
    if mark_comment_processed:
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
    # Planning Stage
    # ==========================================================

    planner = PlannerService()

    plan = planner.build_plan(
        ai,
        context.get_context()
    )

    context.set_plan(plan)

    print("\n========== PLAN ==========\n")
    print(plan)
    print("\n==========================\n")

    # Validate plan is actionable — check that it references at least one project file
    plan_references_files = any(
        path in plan for path in project.keys()
    )

    if len(plan.strip()) < 50 or not plan_references_files:
        print("⚠️  Plan does not contain actionable changes (no project files referenced).")
        feedback_service.report(
            issue,
            "ℹ️ I couldn't turn this feedback into a concrete code change "
            "(no existing project file was referenced). Try rephrasing with "
            "a specific page or section to change."
        )
        feedback_service.mark_processed(comment)
        print("🎉 Agent Exiting — nothing to do.")
        exit(0)

    os.makedirs("plans", exist_ok=True)

    with open("plans/latest.md", "w", encoding="utf-8") as file:
        file.write(plan)

    # ==========================================================
    # Developer Stage — generate, parse & validate, with retries
    # ==========================================================

    developer = DeveloperService()
    parser = PatchParser()
    target_files = DeveloperService.resolve_target_files(plan)

    file_matches = None
    previous_error = None

    for attempt in range(1, MAX_PATCH_ATTEMPTS + 1):
        print(f"🔧 Generating patch (attempt {attempt}/{MAX_PATCH_ATTEMPTS})...")

        patch = developer.generate_patch(
            ai,
            context.get_context(),
            previous_error=previous_error
        )

        os.makedirs("patches", exist_ok=True)
        with open("patches/latest.patch", "w", encoding="utf-8") as file:
            file.write(patch)

        print("\n========== RAW PATCH OUTPUT (first 500 chars) ==========")
        print(patch[:500])
        print("========================================================\n")

        try:
            candidates = parser.parse(patch, plan)
            file_matches = validate_file_paths(candidates, project, target_files)
            print("✅ Patch Parsed & Validated")
            break
        except (PatchParseError, PatchSecurityError) as e:
            previous_error = str(e)
            print(f"⚠️ Attempt {attempt}/{MAX_PATCH_ATTEMPTS} failed: {previous_error}")

    if file_matches is None:
        fail(
            f"the AI could not produce a valid, safe patch after "
            f"{MAX_PATCH_ATTEMPTS} attempts ({previous_error})",
            mark_comment_processed=True
        )

    # ==========================================================
    # Apply Patch — backup & rollback
    # ==========================================================

    backups = {}
    for file_path, _ in file_matches:
        if os.path.exists(file_path):
            backup_path = file_path + ".bak"
            shutil.copy2(file_path, backup_path)
            backups[file_path] = backup_path

    for file_path, file_content in file_matches:
        os.makedirs(os.path.dirname(file_path) or '.', exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file_content)
        print(f"  ✏️  Wrote: {file_path}")

    print("✅ Patch Applied")

    # ==========================================================
    # Validate
    # ==========================================================

    validator = Validator()

    success, error = validator.run()

    if not success:
        print("\n🔄 Rolling back changes...")
        for original, backup in backups.items():
            shutil.move(backup, original)
            print(f"  ↩️  Restored: {original}")
        for file_path, _ in file_matches:
            if file_path not in backups and os.path.exists(file_path):
                os.remove(file_path)
                print(f"  🗑️  Removed new file: {file_path}")
        print("✅ Rollback complete — no broken code was committed.")
        fail(f"the build failed and changes were rolled back.\n\n```\n{error[-1500:]}\n```", mark_comment_processed=True)

    # Clean up backup files
    for backup in backups.values():
        if os.path.exists(backup):
            os.remove(backup)

    print("✅ Build Successful")

    # ==========================================================
    # Commit
    # ==========================================================

    git = GitService()

    committed, git_error = git.commit("Daily Portfolio Improvement")

    if git_error:
        # The build was valid but git failed (push race, auth, etc). Do NOT
        # mark the comment processed — this is a good, working patch that
        # never made it to the remote, and it's worth retrying as-is.
        fail(f"the change built successfully but could not be committed/pushed.\n\n```\n{git_error}\n```")

    if not committed:
        feedback_service.report(
            issue,
            "ℹ️ Generated a patch for this feedback, but it produced no "
            "actual file changes (already up to date)."
        )
        feedback_service.mark_processed(comment)
        print("🎉 Agent Finished — nothing to commit")
        exit(0)

    print("✅ Changes Committed")

    goal_line = next((line for line in plan.splitlines() if line.startswith("GOAL:")), plan.splitlines()[0])
    changed_files = ", ".join(f"`{p}`" for p, _ in file_matches)
    feedback_service.report(
        issue,
        f"✅ Applied this feedback and pushed a change.\n\n"
        f"**{goal_line}**\n\n"
        f"Files changed: {changed_files}"
    )
    feedback_service.mark_processed(comment)

    print("\n🎉 Agent Finished Successfully")

except Exception as e:
    # Guarantee the user finds out something broke, even on an unexpected
    # crash, instead of only seeing a red X in the Actions tab.
    print(traceback.format_exc())
    feedback_service.report(
        issue,
        f"⚠️ Daily update crashed unexpectedly: `{e}`\n\nCheck the Actions log for details."
    )
    exit(1)
