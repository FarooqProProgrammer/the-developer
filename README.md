# the-developer

Cursor **plugin** + Spec Kit companion for AI-assisted development.

Full plugin docs: [PLUGIN.md](PLUGIN.md)

## Quick install (local plugin)

```powershell
.\scripts\install-plugin-local.ps1
```

Then **Developer: Reload Window** → open **Customize** → confirm `the-developer`.

## What you get

| Layer | Role |
|-------|------|
| Spec Kit (per project) | specify → plan → tasks → implement → converge |
| Ponytail | Minimal code ladder (`rules/ponytail.mdc` + skills) |
| CodeGraph | MCP `codegraph_explore` + sync hooks |
| DB MCPs | Postgres / MySQL / MongoDB via `mcp.json` + env (see `docs/mcp-databases.env.example`) |
| Next.js MCP | `next-devtools` (`next-devtools-mcp`) — use when the app is Next.js 16+ with `npm run dev` |
| Companion | review, debug, commit, grill, frontend-design, React best practices, agent-browser |

## Host CLIs

```bash
npm i -g @colbymchenry/codegraph agent-browser
agent-browser install
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

In each app repo:

```bash
specify init --here --integration cursor-agent
codegraph init
```

## Chat commands

| Command | Does |
|---------|------|
| `/feature-pipeline` | Spec Kit SDD stages |
| `/grill-me` | Stress-test the plan |
| `/code-review` | Correctness review |
| `/browser-test` | agent-browser QA |
| `/codebase-design` | Deep modules / seams |
| `/diagnose-bug` | Hard-bug diagnosis loop |
| `/tdd` | Test-first red-green-refactor |
| `/prototype` | Throwaway prototype before change |
| `/to-spec` | Conversation → spec/PRD (issue tracker) |
| `/hyperframes-demo` | End-user demo via HyperFrames CLI |
| `/extract-meaning-full-insight` | Insight pack from a user document |
| `/document-to-flowchart` | Document → Mermaid flowchart |

## Plugin package layout

```text
.cursor-plugin/plugin.json   # Cursor Plugin manifest
rules/                       # always-on + glob rules
skills/                      # companion + ponytail + design/QA skills
agents/the-developer.md
commands/
hooks/hooks.json             # CodeGraph sync
scripts/codegraph-sync.js
mcp.json                     # CodeGraph MCP
assets/logo.svg
```

Publish: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)

## Docs

- [Cursor Plugins](https://cursor.com/docs/plugins)
- [Spec Kit](https://github.com/github/spec-kit)
- [Ponytail](https://github.com/DietrichGebert/ponytail)
- [CodeGraph](https://github.com/colbymchenry/codegraph)
- [agent-browser](https://www.skills.sh/vercel-labs/agent-browser/agent-browser)
- [vercel-react-best-practices](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)
- [codebase-design](https://www.skills.sh/mattpocock/skills/codebase-design)
- [diagnosing-bugs](https://www.skills.sh/mattpocock/skills/diagnosing-bugs)
- [tdd](https://www.skills.sh/mattpocock/skills/tdd)
- [prototype](https://www.skills.sh/mattpocock/skills/prototype)
- [to-spec](https://www.skills.sh/mattpocock/skills/to-spec) (skills.sh still lists the old name [to-prd](https://www.skills.sh/mattpocock/skills/to-prd))
