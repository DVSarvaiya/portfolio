import os

from dotenv import load_dotenv

from github_service import GitHubService
from ai_service import AIService
from file_manager import FileManager
from feedback_service import FeedbackService
from execution_context import ExecutionContext
from planner_service import PlannerService
from developer_service import DeveloperService
from patch_engine import PatchEngine
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
# Apply Patch
# ==========================================================

engine = PatchEngine()

success, error = engine.apply(patch)

if not success:
    print("\n❌ Patch Apply Failed\n")
    print(error)
    exit(1)

print("✅ Patch Applied")

# ==========================================================
# Validate
# ==========================================================

validator = Validator()

success, error = validator.run()

if not success:
    print("\n❌ Validation Failed\n")
    print(error)
    exit(1)

print("✅ Build Successful")

# ==========================================================
# Commit
# ==========================================================

git = GitService()

git.commit("Daily Portfolio Improvement")

print("✅ Changes Committed")
print("\n🎉 Agent Finished Successfully")