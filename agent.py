import os
import re

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

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv()

GH_TOKEN = os.getenv("GH_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
REPOSITORY = os.getenv("GITHUB_REPOSITORY")
MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")

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

if feedback:
    print("✅ Feedback Loaded")
else:
    print("ℹ️ No previous feedback found")
    print("🎉 Agent Exiting Gracefully")
    exit(0)

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

os.makedirs("plans", exist_ok=True)

with open("plans/latest.md", "w", encoding="utf-8") as file:
    file.write(plan)

# ==========================================================
# Developer Stage
# ==========================================================

developer = DeveloperService()

patch = developer.generate_patch(
    ai,
    context.get_context()
)

print("✅ Patch Generated")

os.makedirs("patches", exist_ok=True)

with open("patches/latest.patch", "w", encoding="utf-8") as file:
    file.write(patch)

# ==========================================================
# Apply Patch (XML file blocks) with backup & rollback
# ==========================================================

print("\n========== RAW PATCH OUTPUT (first 500 chars) ==========")
print(patch[:500])
print("========================================================\n")

# Strip markdown wrappers if present
md_match = re.search(r'```(?:xml)?\s*(.*?)\s*```', patch, re.DOTALL)
if md_match:
    patch = md_match.group(1)

# Parse XML file blocks — only COMPLETE blocks with closing tags
file_pattern = re.compile(
    r'<file>\s*<path>(.*?)</path>\s*<content>(.*?)</content>\s*</file>',
    re.DOTALL
)
file_matches = file_pattern.findall(patch)

# Detect truncated blocks (opened but never closed)
open_count = patch.count('<file>')
close_count = patch.count('</file>')
if open_count > close_count:
    print(f"⚠️  Warning: LLM output was truncated ({open_count} blocks opened, {close_count} closed)")
    print(f"   Only {close_count} complete block(s) will be applied.\n")

if not file_matches:
    print("\n❌ Patch Apply Failed\n")
    print("No valid <file> XML blocks found in the LLM output.")
    print("Full output was:")
    print(patch[:2000])
    exit(1)

# Backup files before writing
import shutil
backups = {}
for file_path, _ in file_matches:
    file_path = file_path.strip()
    if os.path.exists(file_path):
        backup_path = file_path + ".bak"
        shutil.copy2(file_path, backup_path)
        backups[file_path] = backup_path

# Write files
for file_path, file_content in file_matches:
    file_path = file_path.strip()
    file_content = file_content.strip() + '\n'
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
    print("\n❌ Validation Failed\n")
    print(error)
    # Rollback all files from backups
    print("\n🔄 Rolling back changes...")
    for original, backup in backups.items():
        shutil.move(backup, original)
        print(f"  ↩️  Restored: {original}")
    # Clean up any new files that didn't have backups
    for file_path, _ in file_matches:
        file_path = file_path.strip()
        if file_path not in backups and os.path.exists(file_path):
            os.remove(file_path)
            print(f"  🗑️  Removed new file: {file_path}")
    print("✅ Rollback complete — no broken code was committed.")
    exit(1)

# Clean up backup files
for backup in backups.values():
    if os.path.exists(backup):
        os.remove(backup)

print("✅ Build Successful")

# ==========================================================
# Commit
# ==========================================================

git = GitService()

git.commit("Daily Portfolio Improvement")

print("✅ Changes Committed")
print("\n🎉 Agent Finished Successfully")