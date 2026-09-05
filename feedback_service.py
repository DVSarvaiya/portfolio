TRUSTED_ASSOCIATIONS = {"OWNER", "MEMBER", "COLLABORATOR"}
PROCESSED_REACTION = "+1"


class FeedbackService:

    def __init__(self, repo):
        self.repo = repo

    def get_latest_feedback(self):
        """Find the newest actionable comment on the open "Daily Update" issue.

        A comment only counts as feedback if:
          - it comes from a trusted author (owner/member/collaborator), so a
            random commenter on a public issue can't inject instructions
            that get committed and deployed, and
          - it hasn't already been processed (marked with a 👍 reaction by
            this bot), so the same feedback isn't reapplied on every run.
        """

        issues = self.repo.get_issues(
            state="open",
            sort="created",
            direction="desc"
        )

        for issue in issues:

            if not issue.title.startswith("Daily Update"):
                continue

            comments = list(issue.get_comments())

            for comment in reversed(comments):

                if comment.author_association not in TRUSTED_ASSOCIATIONS:
                    continue

                if self._already_processed(comment):
                    continue

                return {
                    "issue": issue,
                    "comment": comment,
                    "feedback": comment.body
                }

            return {
                "issue": issue,
                "comment": None,
                "feedback": ""
            }

        return {
            "issue": None,
            "comment": None,
            "feedback": ""
        }

    def _already_processed(self, comment):
        try:
            for reaction in comment.get_reactions():
                if reaction.content == PROCESSED_REACTION and reaction.user.type == "Bot":
                    return True
        except Exception:
            pass
        return False

    def mark_processed(self, comment):
        if not comment:
            return
        try:
            comment.create_reaction(PROCESSED_REACTION)
        except Exception as e:
            print(f"⚠️ Could not mark comment as processed: {e}")

    def report(self, issue, body):
        """Post a status comment back to the issue so the outcome is visible
        without needing to open the Actions log."""
        if not issue:
            return
        try:
            issue.create_comment(body)
        except Exception as e:
            print(f"⚠️ Could not post status comment: {e}")
