# the-developer (Cursor Plugin)

AI development companion packaged as a **[Cursor Plugin](https://cursor.com/docs/plugins)**.

Bundles rules, skills, commands, hooks, an agent, and CodeGraph MCP for Spec-driven delivery with Ponytail minimalism.

## Install (local test)

```powershell
$src = "D:\ai agent\the-developer"
$dest = "$env:USERPROFILE\.cursor\plugins\local\the-developer"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
# Copy plugin payload (not vendor / .codegraph / nested git)
robocopy $src $dest /E /XD .git vendor .codegraph node_modules .specify /NFL /NDL /NJH /NJS
```

Then **Developer: Reload Window**, open **Customize**, and confirm `the-developer` components.

Or run:

```powershell
.\scripts\install-plugin-local.ps1
```

## Marketplace / team

1. Push this repo (or the plugin tree) to GitHub
2. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
3. Or add the repo to a Team Marketplace under Dashboard → Plugins & MCPs

## What ships

| Component | Contents |
|-----------|----------|
| **Rules** | Intent router, coding standards, Ponytail ladder, CodeGraph, SEO public pages, React best-practices gate, git branch safety, hallmark-frontend, frontend-mockup-first, module-checklist |
| **Skills** | code-review, debug, commit, frontend-design, **hallmark**, ui-case-studies, grill-me/grilling, ponytail*, agent-browser, vercel-react-best-practices, nodejs-backend-patterns, codebase-design, extract-modules-checklist, diagnosing-bugs, tdd, prototype, to-spec, hyperframes-demo (**optional**), extract-meaning-full-insight, document-to-flowchart, claude-delegate |
| **Commands** | `/feature-pipeline`, `/grill-me`, `/code-review`, `/browser-test`, `/codebase-design`, `/nodejs-backend-patterns`, `/diagnose-bug`, `/tdd`, `/prototype`, `/to-spec`, `/hyperframes-demo`, `/extract-meaning-full-insight`, `/document-to-flowchart`, `/hallmark`, `/ui-case-studies`, `/extract-modules-checklist`, `/claude-delegate` |
| **Agent** | `the-developer` |
| **Hooks** | CodeGraph sync on `sessionStart`, `beforeReadFile`, `afterFileEdit`; mockup-first on `beforeSubmitPrompt` / `preToolUse` for new screens |
| **MCP** | `codegraph`, `postgres`, `mysql`, `mongodb`, `next-devtools`, `inspo` (DB URLs via env — see below) |

**Not bundled:** Spec Kit CLI/skills (install per project with `specify init --here --integration cursor-agent`). Ponytail mode hooks (plugin uses always-on `rules/ponytail.mdc` instead).

## Database MCP (Postgres / MySQL / MongoDB)

`mcp.json` ships default stdio servers. Set env vars (never commit secrets):

| Server | Package | Env |
|--------|---------|-----|
| `postgres` | `@modelcontextprotocol/server-postgres` | `POSTGRES_URL` |
| `mysql` | `@benborla29/mcp-server-mysql` | `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASS`, `MYSQL_DB` |
| `mongodb` | `mongodb-mcp-server` | `MONGODB_URI` |

Example values: [`docs/mcp-databases.env.example`](docs/mcp-databases.env.example). Reload MCP after setting env. MySQL stays read-only unless you opt into write flags per that package’s docs. Postgres MCP is read-only.

## Next.js MCP (`next-devtools`)

Ships by default as `next-devtools` → `npx -y next-devtools-mcp@latest` ([Next.js MCP guide](https://nextjs.org/docs/app/guides/mcp)).

**Use when the app is a Next.js project.** Runtime tools need **Next.js 16+** and a running `npm run dev` (endpoint `/_next/mcp`). On older Next, upgrade first or ignore this server.

Agent flow: `nextjs_index` → `nextjs_call` / `nextjs_docs` as needed. Harmless in non-Next workspaces (discovery returns no servers).

## Inspo MCP (design archive)

Ships by default as `inspo` → hosted [https://inspomcp.dev/api/mcp](https://inspomcp.dev/api/mcp) ([Inspo](https://inspomcp.dev/)).

Pulls real production-site captures, DESIGN.md, components, and palettes for UI taste. Use with **`hallmark`** (required for frontend design/update) and `frontend-design`.

Optional local stdio: `"inspo": { "command": "npx", "args": ["-y", "inspo-mcp"] }`. Optional env: `TOGETHER_API_KEY`, `INSPO_PROFILE=lite|full`, `INSPO_IMAGES=thumbs|none`.

## Hallmark (required for frontend)

Skill from [nutlope/hallmark](https://github.com/nutlope/hallmark). **Must** load when designing new UI or updating frontend visuals (`/hallmark`). Verbs: default build, `audit`, `redesign`, `study`.

## External CLIs (host machine)

```bash
npm i -g @colbymchenry/codegraph agent-browser
codegraph install   # wire agents if needed
agent-browser install
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

## Usage in a project

1. Install this plugin (user or project scope)
2. In the app repo: `specify init --here --integration cursor-agent` (once)
3. `codegraph init` in that repo
4. Chat: `/feature-pipeline` for features, `/hallmark` for any UI design/update, `/nodejs-backend-patterns` for Node APIs/backends, `/extract-modules-checklist` before large refactors, `/claude-delegate` when explicitly delegating to Claude Code CLI, `/prototype` before changes, `/to-spec` for a conversation→spec/PRD, `/extract-meaning-full-insight` for document insights, `/document-to-flowchart` for process diagrams, optional `/hyperframes-demo` only when you want a video demo, `/grill-me` to stress-test, `/codebase-design` for seams, `/tdd` for test-first work, `/diagnose-bug` for hard bugs, `/browser-test` for QA

## Plugin layout

```text
.cursor-plugin/plugin.json
rules/
skills/
agents/
commands/
hooks/hooks.json
scripts/codegraph-sync.js
scripts/regenerate-folder-structure.js
mcp.json
assets/logo.svg
```

Legacy project paths under `.cursor/` remain for developing this repo itself; the **plugin source of truth** is the root folders above.
