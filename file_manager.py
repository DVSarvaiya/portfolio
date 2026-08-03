from pathlib import Path


class FileManager:

    def __init__(self, root="."):
        self.root = Path(root)

    def read_file(self, relative_path):

        file = self.root / relative_path

        if not file.exists():
            return None

        return file.read_text(encoding="utf-8")

    def collect_project_files(self):

        allowed_extensions = {
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".css",
            ".json",
            ".md"
        }

        ignored = {
            "node_modules",
            ".git",
            ".next",
            "logs",
            "venv",
            "__pycache__",
            "patches",
            "plans"
        }

        ignored_files = {
            "package-lock.json",
        }

        project = {}

        for file in self.root.rglob("*"):

            if not file.is_file():
                continue

            if any(folder in file.parts for folder in ignored):
                continue

            if file.suffix not in allowed_extensions:
                continue

            if file.name in ignored_files:
                continue

            relative = file.relative_to(self.root)

            try:
                project[str(relative)] = file.read_text(
                    encoding="utf-8"
                )
            except:
                pass

        return project