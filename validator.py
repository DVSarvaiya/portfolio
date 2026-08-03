import subprocess


class Validator:

    def run(self):

        lint = subprocess.run(

            ["npm", "run", "lint"],

            capture_output=True,

            text=True
        )

        if lint.returncode != 0:

            return False, lint.stderr

        build = subprocess.run(

            ["npm", "run", "build"],

            capture_output=True,

            text=True
        )

        if build.returncode != 0:

            return False, build.stderr

        return True, ""