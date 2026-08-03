import subprocess


class Validator:

    def run(self):

        build = subprocess.run(
            ["npm", "run", "build"],
            capture_output=True,
            text=True
        )

        if build.returncode != 0:
            error_output = ""
            if build.stdout:
                error_output += build.stdout[-3000:]
            if build.stderr:
                error_output += "\n" + build.stderr[-2000:]
            return False, error_output.strip()

        return True, ""