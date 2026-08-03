import subprocess
import tempfile
import re


class PatchEngine:

    def apply(self, patch):

        # Strip markdown code blocks if the LLM hallucinated them
        match = re.search(r'```(?:diff)?\s*(.*?)\s*```', patch, re.DOTALL)
        if match:
            patch = match.group(1)
        elif patch.startswith('```'):
            # Fallback if closing ticks are missing
            patch = patch.split('\n', 1)[-1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".patch",
            mode="w"
        ) as file:

            file.write(patch)

            patch_file = file.name

        result = subprocess.run(

            [
                "git",
                "apply",
                patch_file
            ],

            capture_output=True,

            text=True
        )

        return result.returncode == 0, result.stderr