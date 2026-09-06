import subprocess


class Validator:

    def run(self, timeout=600):

        try:
            build = subprocess.run(
                ["npm", "run", "build"],
                capture_output=True,
                text=True,
                timeout=timeout
            )
        except subprocess.TimeoutExpired:
            return False, f"Build timed out after {timeout}s — the generated code likely has an infinite loop or hang."

        if build.returncode != 0:
            error_output = ""
            if build.stdout:
                error_output += build.stdout[-3000:]
            if build.stderr:
                error_output += "\n" + build.stderr[-2000:]
            return False, error_output.strip()

        return True, ""
