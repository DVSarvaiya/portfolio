import subprocess


class GitService:

    def commit(self, message):

        subprocess.run(["git", "add", "."])

        diff = subprocess.run(

            ["git", "diff", "--cached", "--quiet"]
        )

        if diff.returncode == 0:

            print("Nothing changed.")

            return False

        subprocess.run(

            [
                "git",
                "commit",
                "-m",
                message
            ]
        )

        subprocess.run(

            [
                "git",
                "push"
            ]
        )

        return True