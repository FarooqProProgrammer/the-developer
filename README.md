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
| Inspo MCP | `inspo` ([inspomcp.dev](https://inspomcp.dev/)) — real-site design references for UI work |
| Figma → code | `figma-design-to-code` when using Figma MCP (Cursor Figma plugin) |
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
| `/brainstorming` | Intent & design before creative work |
| `/grill-me` | Stress-test the plan |
| `/code-review` | Correctness review |
| `/browser-test` | agent-browser QA |
| `/codebase-design` | Deep modules / seams |
| `/nodejs-backend-patterns` | Node.js API / backend patterns |
| `/nestjs-best-practices` | NestJS architecture / DI / security |
| `/nestjs-expert` | NestJS expert workflow + detailed guide |
| `/diagnose-bug` | Hard-bug diagnosis loop |
| `/tdd` | Test-first red-green-refactor |
| `/prototype` | Throwaway prototype before change |
| `/to-spec` | Conversation → spec/PRD (issue tracker) |
| `/hyperframes-demo` | Optional HyperFrames video demo (user must ask) |
| `/extract-meaning-full-insight` | Insight pack from a user document |
| `/document-to-flowchart` | Document → Mermaid flowchart |
| `/hallmark` | Anti-AI-slop UI (required for frontend design/update) |
| `/figma-design-to-code` | Figma MCP design → code (when Figma MCP enabled) |
| `/ui-case-studies` | Settings & common-screen content defaults |
| `/extract-modules-checklist` | Extract modules → checklist |
| `/claude-delegate` | Delegate impl to Claude Code CLI |

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
- [nodejs-backend-patterns](https://www.skills.sh/wshobson/agents/nodejs-backend-patterns)
- [nestjs-best-practices](https://www.skills.sh/kadajett/agent-nestjs-skills/nestjs-best-practices)
- [nestjs-expert](https://www.skills.sh/sickn33/agentic-awesome-skills/nestjs-expert)
- [brainstorming](https://www.skills.sh/obra/superpowers/brainstorming)
- [figma-design-to-code](https://www.skills.sh/figma/mcp-server-guide/figma-design-to-code)
- [codebase-design](https://www.skills.sh/mattpocock/skills/codebase-design)
- [diagnosing-bugs](https://www.skills.sh/mattpocock/skills/diagnosing-bugs)
- [tdd](https://www.skills.sh/mattpocock/skills/tdd)
- [prototype](https://www.skills.sh/mattpocock/skills/prototype)
- [to-spec](https://www.skills.sh/mattpocock/skills/to-spec) (skills.sh still lists the old name [to-prd](https://www.skills.sh/mattpocock/skills/to-prd))
- [claude-delegate](https://www.skills.sh/amelnagdy/delegate-skills/claude-delegate)