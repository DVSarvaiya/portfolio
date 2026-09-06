"""The iterative loop: plan -> patch -> build, feeding each failure back into
the next attempt until the build passes or the iteration budget runs out.

Every stage failure used to end the run. Now a failure is just context for
the next round, which is what lets a weak free model converge on something
that actually compiles instead of giving up on its first bad answer.
"""

import os
import shutil

from .planner_service import PlannerService, validate_plan, synthesize_plan
from .developer_service import DeveloperService
from .patch_parser import PatchParser, PatchParseError, PatchSecurityError, validate_file_paths
from .file_resolver import infer_files
from .validator import Validator

# Hard ceiling so a stuck agent can never loop forever.
DEFAULT_MAX_ITERATIONS = 10

# After this many failed planning attempts, stop asking the model for a plan
# and build one from the files the feedback points at.
PLAN_ATTEMPTS_BEFORE_FALLBACK = 2


class RunResult:

    def __init__(self, status, plan=None, files=None, iterations=0, error=None, history=None):
        self.status = status          # "ready" | "failed"
        self.plan = plan
        self.files = files or []      # list of (path, content)
        self.iterations = iterations
        self.error = error
        self.history = history or []  # human-readable log of what was tried


class AgentRunner:

    def __init__(self, ai, context, max_iterations=DEFAULT_MAX_ITERATIONS):
        self.ai = ai
        self.context = context
        self.max_iterations = max_iterations
        self.planner = PlannerService()
        self.developer = DeveloperService()
        self.parser = PatchParser()
        self.validator = Validator()
        self.history = []

    def _log(self, iteration, message):
        line = f"[{iteration}/{self.max_iterations}] {message}"
        print(f"   {line}")
        self.history.append(line)

    def run(self):
        project = self.context.get_context()["project"]
        feedback = self.context.get_context()["feedback"]

        plan = None
        target_files = None
        plan_attempts = 0
        previous_error = None
        last_error = None
        repeated = 0

        for iteration in range(1, self.max_iterations + 1):
            print(f"\n───── Iteration {iteration}/{self.max_iterations} ─────")

            # ---------- Plan ----------
            if plan is None:
                plan_attempts += 1

                if plan_attempts > PLAN_ATTEMPTS_BEFORE_FALLBACK:
                    inferred = infer_files(feedback, project)
                    plan = synthesize_plan(feedback, inferred)
                    target_files = inferred
                    self._log(iteration, f"planning fell back to inferred files: {', '.join(inferred)}")
                    previous_error = None
                else:
                    raw_plan = self.planner.build_plan(
                        self.ai,
                        self.context.get_context(),
                        previous_error=previous_error,
                    )
                    print("\n========== PLAN ==========\n")
                    print(raw_plan)
                    print("\n==========================\n")

                    files, error = validate_plan(raw_plan, project)

                    if error:
                        last_error = error
                        previous_error = error
                        self._log(iteration, f"plan rejected: {error}")
                        continue

                    plan = raw_plan
                    target_files = files
                    previous_error = None
                    self._log(iteration, f"plan accepted, targets: {', '.join(target_files)}")

                self.context.set_plan(plan)
                self._save("plans/latest.md", plan)

            # ---------- Patch ----------
            patch = self.developer.generate_patch(
                self.ai,
                self.context.get_context(),
                target_files,
                previous_error=previous_error,
            )
            self._save("patches/latest.patch", patch)

            try:
                candidates = self.parser.parse(patch, plan)
                file_matches = validate_file_paths(candidates, project, target_files)
            except (PatchParseError, PatchSecurityError) as e:
                repeated = repeated + 1 if str(e) == last_error else 0
                last_error = str(e)
                previous_error = last_error
                self._log(iteration, f"patch rejected: {last_error}")

                # Hitting the identical wall twice means the plan itself is
                # the problem — change strategy instead of burning the budget.
                if repeated >= 1:
                    plan = None
                    target_files = None
                    previous_error = (
                        f"Every attempt at the previous plan failed with: {last_error}. "
                        "Plan a different change that avoids this entirely."
                    )
                    self._log(iteration, "same failure twice — re-planning")
                    repeated = 0
                continue

            # Carry any file the model actually wrote (including new ones it
            # decided it needed) into the next round's prompt, so a retry
            # doesn't silently forget a component it just created.
            for path, _ in file_matches:
                if path not in target_files:
                    target_files.append(path)

            # ---------- Apply ----------
            backups = self._apply(file_matches)

            # ---------- Build ----------
            success, build_error = self.validator.run()

            if success:
                self._cleanup_backups(backups)
                self._log(iteration, f"build passed with {len(file_matches)} file(s) changed")
                return RunResult(
                    status="ready",
                    plan=plan,
                    files=file_matches,
                    iterations=iteration,
                    history=self.history,
                )

            self._rollback(file_matches, backups)
            last_error = build_error
            previous_error = (
                "The build failed with this error. Fix the specific cause and "
                "return the complete corrected file(s):\n"
                f"{build_error[-1500:]}"
            )
            self._log(iteration, "build failed, rolled back and retrying")

            # A plan that keeps producing broken builds is probably the problem,
            # not just the code — re-plan from scratch every third failure.
            if iteration % 3 == 0:
                plan = None
                target_files = None
                previous_error = f"A previous plan produced code that would not build: {build_error[-400:]}"
                self._log(iteration, "re-planning from scratch")

        return RunResult(
            status="failed",
            plan=plan,
            iterations=self.max_iterations,
            error=last_error,
            history=self.history,
        )

    # ------------------------------------------------------------------

    def _save(self, path, content):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(content)

    def _apply(self, file_matches):
        backups = {}
        for path, _ in file_matches:
            if os.path.exists(path):
                backup = path + ".bak"
                shutil.copy2(path, backup)
                backups[path] = backup

        for path, content in file_matches:
            os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(content)
            label = "created" if path not in backups else "updated"
            print(f"  ✏️  {label}: {path}")

        return backups

    def _rollback(self, file_matches, backups):
        for original, backup in backups.items():
            shutil.move(backup, original)
        for path, _ in file_matches:
            if path not in backups and os.path.exists(path):
                os.remove(path)

    def _cleanup_backups(self, backups):
        for backup in backups.values():
            if os.path.exists(backup):
                os.remove(backup)
