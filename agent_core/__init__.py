"""Everything the daily-update agent is built from.

The entry point is agent.py in the repo root; this package holds the parts
it wires together:

  agent_runner.py     the plan -> patch -> build loop that retries until green
  planner_service.py  turns feedback into a plan, and validates/repairs it
  developer_service.py turns a plan into complete file contents
  patch_parser.py     parses the model's <file> blocks and guards the paths
  file_resolver.py    maps loose file references onto real project files
  validator.py        runs the Next.js build
  git_service.py      stage/commit/push with real error reporting
  github_service.py   GitHub connection
  feedback_service.py reads issue comments, reacts, posts status back
  file_manager.py     reads the site's source files
  execution_context.py the feedback/plan/project bundle passed between stages
"""
