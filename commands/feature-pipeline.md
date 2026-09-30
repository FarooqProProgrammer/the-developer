---
name: feature-pipeline
description: Run Spec Kit SDD for a new feature (specify → plan → tasks → implement → converge)
---

# Feature pipeline (Spec Kit)

Ensure the project has Spec Kit (`specify init --here --integration cursor-agent` if missing).

Then run **one stage at a time**, waiting for review between stages:

1. `/speckit-specify` — capture what/why from the user request
2. Optional `/grill-me` — stress-test the plan before locking design
3. Optional `/speckit-clarify`
4. `/speckit-plan`
5. `/speckit-tasks`
6. Optional `/speckit-analyze` / `/speckit-checklist`
7. `/speckit-implement` — Ponytail ladder + React best practices + SEO rules while coding
8. `/speckit-converge` — repeat with implement until Converged

Do not invent a custom Speckit pipeline. Stack from user request + repo only.
