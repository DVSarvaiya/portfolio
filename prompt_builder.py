class PromptBuilder:

    def build(
        self,
        project_files,
        feedback
    ):

        prompt = ""

        prompt += """
You are a Senior Next.js Engineer.

Your task is to improve my portfolio.

Never remove working functionality.

Improve UI.

Improve UX.

Improve performance.

"""

        prompt += "\n"

        prompt += "USER FEEDBACK\n"

        prompt += feedback

        prompt += "\n\n"

        prompt += "PROJECT FILES\n"

        for path, content in project_files.items():

            prompt += f"\nFILE: {path}\n"

            prompt += content

            prompt += "\n"

        return prompt