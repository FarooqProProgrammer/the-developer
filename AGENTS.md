# Agent guide — the-developer

This repo is the source for the **the-developer Cursor Plugin** (see [PLUGIN.md](PLUGIN.md) and `.cursor-plugin/plugin.json`).

When working **inside this repo**, project `.cursor/` still applies. When the plugin is installed, components load from the plugin package (`rules/`, `skills/`, …).

This companion combines:

- **[Spec Kit](https://github.com/github/spec-kit)** — spec-driven features
- **[Ponytail](https://github.com/DietrichGebert/ponytail)** — lazy-senior minimalism
- **[CodeGraph](https://github.com/colbymchenry/codegraph)** — local code knowledge graph + MCP

## Route every request

### Canonical feature delivery

```text
input → brainstorming → grill-me / document / feature list → Spec Kit → implement
```

1. **Input** — idea, doc, ticket, or Figma. Infer stack; ask once if unclear.
2. **Brainstorming** → `.cursor/skills/brainstorming/SKILL.md` ([brainstorming](https://www.skills.sh/obra/superpowers/brainstorming)). Intent + design approval; hard gate before Spec Kit / product code.
3. **Grill / document / feature list** → `/grill-me` (`.cursor/skills/grilling/SKILL.md`), write a short durable brief, scoped feature list (optional `/to-spec`). Confirm with the user.
4. **Handover to Spec Kit** — feed brief + feature list into Spec Kit stages (do **not** invent a parallel pipeline):

   ```text
   /speckit-constitution   # if constitution not yet ratified / still placeholders
   /speckit-specify
   /speckit-plan           # after clarify if needed
   /speckit-tasks
   /speckit-implement
   /speckit-converge
   ```

   Optional: `/speckit-clarify`, `/speckit-checklist`, `/speckit-analyze`.
   Or invoke `/feature-pipeline` to run this whole flow stage-by-stage.
   While implementing: Ponytail ladder + CodeGraph; optional `prototype` when a throwaway probe still helps.

### Other intents

5. **Structural explore / “how does X work”** → MCP `codegraph_explore` first (not grep/Read loops). Hooks keep the index synced.

6. **Correctness / security review** → `.cursor/skills/code-review/SKILL.md`

7. **Over-engineering / delete-list** → `/ponytail-review` (or `/ponytail-audit`)

8. **Quick bug** → `.cursor/skills/debug/SKILL.md`

9. **Commit** → `.cursor/skills/commit/SKILL.md`

10. **Tiny fix / explain** → direct coding under standards + Ponytail; skip Spec Kit

11. **Frontend / UI design or update (required)** → `.cursor/skills/hallmark/SKILL.md` ([hallmark](https://github.com/nutlope/hallmark)) **must** load for any new UI, landing, or frontend visual update. Pair with `.cursor/skills/frontend-design/SKILL.md` and MCP `inspo` ([inspomcp.dev](https://inspomcp.dev/)) for real-site references. For Settings / Profile / Auth / Empty / Dashboard content defaults, load `.cursor/skills/ui-case-studies/SKILL.md`.

11b. **Figma design → code (optional)** → `.cursor/skills/figma-design-to-code/SKILL.md` ([figma-design-to-code](https://www.skills.sh/figma/mcp-server-guide/figma-design-to-code)) **before** Figma MCP `get_design_context`. Use when the user shares a Figma link/node or asks to implement a Figma screen. Requires Figma MCP authenticated in Cursor ([mcp-server-guide](https://github.com/figma/mcp-server-guide)). Then adapt with `hallmark` + project stack.

12. **Browser testing / QA / dogfooding** → `/agent-browser` → then run `agent-browser skills get core` (and `dogfood` for exploratory QA) before any browser commands ([vercel-labs/agent-browser](https://www.skills.sh/vercel-labs/agent-browser/agent-browser)). Prefer agent-browser over built-in browser tools for web app testing.

13. **React / Next.js performance** → `.cursor/skills/vercel-react-best-practices/SKILL.md` ([vercel-react-best-practices](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)) when writing, reviewing, or refactoring React/Next code.

13b. **Node.js backend / API** → `.cursor/skills/nodejs-backend-patterns/SKILL.md` ([nodejs-backend-patterns](https://www.skills.sh/wshobson/agents/nodejs-backend-patterns)) when building or reviewing Express/Fastify services, middleware, auth, DB integration, or REST/GraphQL APIs. Read `references/details.md` for worked patterns.

13c. **NestJS** → `.cursor/skills/nestjs-best-practices/SKILL.md` ([nestjs-best-practices](https://www.skills.sh/kadajett/agent-nestjs-skills/nestjs-best-practices)) for the rule checklist, plus `.cursor/skills/nestjs-expert/SKILL.md` ([nestjs-expert](https://www.skills.sh/sickn33/agentic-awesome-skills/nestjs-expert)) for the expert workflow. Use when writing, reviewing, or refactoring NestJS modules, DI, auth/guards, security, performance, or microservices. Read `rules/*.md` / `references/detailed-guide.md` as needed.

14. **Module / seam / deep-module design** → `.cursor/skills/codebase-design/SKILL.md` ([codebase-design](https://www.skills.sh/mattpocock/skills/codebase-design)).

14b. **Extract modules → checklist** → `.cursor/skills/extract-modules-checklist/SKILL.md`. Use before large refactors/migrations (see `rules/module-checklist.mdc`).

15. **Hard bugs** → `.cursor/skills/diagnosing-bugs/SKILL.md` ([diagnosing-bugs](https://www.skills.sh/mattpocock/skills/diagnosing-bugs)) — prefer over the quick `debug` skill when the bug needs a feedback loop / bisection.

16. **Test-first / red-green-refactor** → `.cursor/skills/tdd/SKILL.md` ([tdd](https://www.skills.sh/mattpocock/skills/tdd)). Confirm seams with the user before writing tests.

17. **Validation probe during implement** → `.cursor/skills/prototype/SKILL.md` ([prototype](https://www.skills.sh/mattpocock/skills/prototype)) when one open question still needs a throwaway LOGIC/UI check. Skip if user says so, or ask is docs/typo/review/commit/explain.

18. **Conversation → spec/PRD (issue tracker)** → `.cursor/skills/to-spec/SKILL.md` ([to-spec](https://www.skills.sh/mattpocock/skills/to-spec); formerly [to-prd](https://www.skills.sh/mattpocock/skills/to-prd)). Useful for the feature-list handover step.

19. **End-user demo video (optional)** → `.cursor/skills/hyperframes-demo/SKILL.md` — only if the user explicitly asks for HyperFrames / a video demo; not part of the default feature path.

20. **Document → full meaning / insights** → `.cursor/skills/extract-meaning-full-insight/SKILL.md`. Take the document from the user (attach / paste / path); produce the insight pack.

21. **Document → flowchart** → `.cursor/skills/document-to-flowchart/SKILL.md`. Take the document from the user; emit a Mermaid flowchart + legend.

22. **Delegate to Claude Code CLI** → `.cursor/skills/claude-delegate/SKILL.md` ([claude-delegate](https://www.skills.sh/amelnagdy/delegate-skills/claude-delegate)). Only when the user explicitly asks to delegate; orchestrate brief → review → land.

## Public page SEO

Every **public** page MUST include unique **title**, **description**, and absolute **canonical**, plus site-level **robots.txt** and **sitemap** (see `.cursor/rules/seo-public-pages.mdc`). Private pages use `noindex`.

## CodeGraph (always for navigation)

- Prefer `codegraph_explore` for structural questions before Read/Grep.
- Hooks (`.cursor/hooks/codegraph-sync.js`):
  - `sessionStart` — init if missing + sync + reminder
  - `beforeReadFile` — debounced `codegraph sync`
  - `afterFileEdit` — debounced `codegraph sync`
- Rule: `.cursor/rules/codegraph.mdc`
- MCP: `.cursor/mcp.json` → `codegraph serve --mcp`
- Index lives in `.codegraph/` (machine-local; not committed)

## Ponytail ladder (always for code)

1. YAGNI → 2. reuse → 3. stdlib → 4. native → 5. installed dep → 6. one line → 7. minimum that works

Never cut: trust-boundary validation, data-loss handling, security, accessibility, explicit asks.

Mode messages: `/ponytail`, `/ponytail lite|full|ultra|off`  
Do **not** add `.cursor/rules/ponytail.mdc` while hooks are installed.

## Hard rules

- Never invent a stack. Infer from request + repo; ask once if unclear.
- Do not skip canonical pipeline stages (`input → brainstorming → grill/doc/features → Spec Kit → implement`) unless the user asks.
- Respect `.specify/memory/constitution.md`.
- Prefer the smallest change that satisfies the request (Ponytail).
- Do not commit/push unless the user asks.
- Never touch production branches (`main` / `master` / `production` / `prod` / `release`); ask which branch to use first (see `rules/git-branch-safety.mdc`).

## Ownership

- **Spec Kit** — `.specify/`, `/speckit-*` skills
- **Ponytail** — hooks + `ponytail*` skills + `vendor/ponytail/`
- **CodeGraph** — MCP, `.codegraph/`, sync hooks, `codegraph.mdc`
- **DB MCP** — `postgres` / `mysql` / `mongodb` in `mcp.json` (credentials via env; see `docs/mcp-databases.env.example`)
- **Next.js MCP** — `next-devtools` (`next-devtools-mcp`); for Next.js 16+ with a running dev server
- **Inspo MCP** — `inspo` ([inspomcp.dev](https://inspomcp.dev/)); real-site design archive for UI / landing taste
- **agent-browser** — browser testing CLI + `.cursor/skills/agent-browser/` (load `agent-browser skills get core` / `dogfood` before use)
- **Companion** — `code-review`, `debug`, `commit`, `frontend-design`, `hallmark`, `ui-case-studies`, `grill-me` / `grilling`, `vercel-react-best-practices`, `nodejs-backend-patterns`, `nestjs-best-practices`, `nestjs-expert`, `brainstorming`, `figma-design-to-code` (when Figma MCP), `codebase-design`, `extract-modules-checklist`, `diagnosing-bugs`, `tdd`, `prototype`, `to-spec`, `hyperframes-demo`, `extract-meaning-full-insight`, `document-to-flowchart`, `claude-delegate`
- **HyperFrames demos (optional)** — `hyperframes-demo` only when the user asks; personal `/hyperframes` / `/hyperframes-cli` skills when present. Not required for default delivery.
