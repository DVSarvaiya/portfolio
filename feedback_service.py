class FeedbackService:

    def __init__(self, repo):
        self.repo = repo

    def get_latest_feedback(self):

        issues = self.repo.get_issues(
            state="open",
            sort="created",
            direction="desc"
        )

        for issue in issues:

            if issue.title.startswith("Daily Update"):

                comments = list(issue.get_comments())

                feedback = ""

                if comments:
                    feedback = comments[-1].body

                return {
                    "issue": issue,
                    "feedback": feedback
                }

        return {
            "issue": None,
            "feedback": ""
        }