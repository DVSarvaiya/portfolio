import subprocess
import time


class GitService:

    def _run(self, args):
        return subprocess.run(args, capture_output=True, text=True)

    def _current_branch(self):
        result = self._run(["git", "rev-parse", "--abbrev-ref", "HEAD"])
        return result.stdout.strip() or "main"

    def _sync_with_remote(self, branch):
        """Fetch + rebase onto the latest remote branch so a push doesn't
        get silently rejected as non-fast-forward. Returns an error string
        on conflict/failure, or None on success (including "nothing to do
        because there is no remote branch yet")."""

        fetch_result = self._run(["git", "fetch", "origin", branch])
        if fetch_result.returncode != 0:
            # Nothing to rebase onto (e.g. branch doesn't exist upstream yet).
            return None

        rebase_result = self._run(["git", "rebase", f"origin/{branch}"])
        if rebase_result.returncode != 0:
            self._run(["git", "rebase", "--abort"])
            error = (rebase_result.stderr or rebase_result.stdout).strip()
            return f"rebase against origin/{branch} conflicted: {error}"

        return None

    def commit(self, message):
        """Stage, commit and push. Returns (committed: bool, error: str|None).

        Raises no exceptions on git failures — callers must check the
        returned status instead of assuming success.
        """

        self._run(["git", "add", "."])

        diff = self._run(["git", "diff", "--cached", "--quiet"])

        if diff.returncode == 0:
            print("Nothing changed.")
            return False, None

        commit_result = self._run(["git", "commit", "-m", message])

        if commit_result.returncode != 0:
            error = (commit_result.stderr or commit_result.stdout).strip()
            return False, f"git commit failed: {error}"

        branch = self._current_branch()

        sync_error = self._sync_with_remote(branch)
        if sync_error:
            return False, f"git push failed: {sync_error}"

        last_error = None
        for attempt in range(1, 4):
            push_result = self._run(["git", "push", "-u", "origin", branch])
            if push_result.returncode == 0:
                return True, None

            last_error = (push_result.stderr or push_result.stdout).strip()
            print(f"⚠️ git push attempt {attempt}/3 failed: {last_error}")

            if attempt < 3:
                # Someone else may have pushed in the meantime — sync and retry.
                sync_error = self._sync_with_remote(branch)
                if sync_error:
                    last_error = sync_error
                    break
                time.sleep(attempt * 5)

        return False, f"git push failed after retries: {last_error}"
