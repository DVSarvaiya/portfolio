class ExecutionContext:

    def __init__(self):

        self.plan = ""

        self.feedback = ""

        self.project = {}

    def set_feedback(self, feedback):

        self.feedback = feedback

    def set_project(self, project):

        self.project = project

    def set_plan(self, plan):

        self.plan = plan

    def get_context(self):

        return {

            "feedback": self.feedback,

            "plan": self.plan,

            "project": self.project

        }