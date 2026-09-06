<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo layout

- `src/` — the portfolio site itself (Next.js App Router). A route is a folder
  with a `page.js` in it; `src/app/page.js` is the home page.
- `agent.py` — entry point for the daily AI update workflow. This is the only
  agent file in the root; run as `python agent.py`.
- `agent_core/` — everything that entry point is built from (planner,
  developer, patch parser, git/GitHub services, its own `requirements.txt`).
  See `agent_core/__init__.py` for what each module does.
- `.github/workflows/daily-update.yml` — schedules the agent and deploys the
  site to GitHub Pages.

The agent only ever writes to `src/` and `public/` — it edits the site, never
its own code.
