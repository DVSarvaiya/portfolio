from github import Github, Auth


class GitHubService:

    def __init__(self, token, repository):

        auth = Auth.Token(token)

        self.github = Github(auth=auth)

        self.repo = self.github.get_repo(repository)

    def get_repo(self):
        return self.repo