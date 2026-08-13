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

# Validate plan is actionable — check that it references at least one project file
plan_references_files = any(
    path in plan for path in project.keys()
)

if len(plan.strip()) < 50 or not plan_references_files:
    print("⚠️  Plan does not contain actionable changes (no project files referenced).")
    print("🎉 Agent Exiting — nothing to do.")
    exit(0)

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

# Strip thinking/reasoning blocks that some models prepend
# Handles: <think>...</think>, "Here's a thinking process:...", etc.
patch = re.sub(r'<think>.*?</think>', '', patch, flags=re.DOTALL)
patch = re.sub(r"^.*?(?=<file>)", '', patch, count=1, flags=re.DOTALL) if '<file>' in patch else patch

# Strip markdown wrappers if present
md_match = re.search(r'```(?:xml)?\s*(.*?)\s*```', patch, re.DOTALL)
if md_match and '<file>' in md_match.group(1):
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

# Fallback: if no XML blocks, try to extract from markdown code fences
if not file_matches:
    print("⚠️  No XML blocks found. Trying fallback parser (markdown code fences)...")

    # Look for ```lang ... ``` blocks and try to map them to project files
    code_blocks = re.findall(r'```(?:jsx?|tsx?|css|html)\s*\n(.*?)```', patch, re.DOTALL)

    if code_blocks:
        # Try to identify which files these belong to using the plan
        plan_text = plan
        plan_files = re.findall(r'[-•]\s*(src/\S+|public/\S+)', plan_text)

        for i, block in enumerate(code_blocks):
            block = block.strip()
            if not block:
                continue

            # Try to match by file extension and plan references
            guessed_path = None
            if i < len(plan_files):
                guessed_path = plan_files[i]
            elif '.css' in block[:100] or block.strip().startswith('/*') or block.strip().startswith(':root') or block.strip().startswith('.') or block.strip().startswith('@'):
                # Looks like CSS
                for pf in plan_files:
                    if pf.endswith('.css'):
                        guessed_path = pf
                        break
                if not guessed_path:
                    guessed_path = "src/app/globals.css"
            elif 'export' in block[:200] or 'import' in block[:200] or 'function' in block[:200]:
                # Looks like JS/JSX
                for pf in plan_files:
                    if pf.endswith('.js') or pf.endswith('.jsx') or pf.endswith('.ts') or pf.endswith('.tsx'):
                        guessed_path = pf
                        break

            if guessed_path and guessed_path not in [m[0] for m in file_matches]:
                file_matches.append((guessed_path, block))
                print(f"  📎 Mapped code block to: {guessed_path}")

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