# Agent guide — the-developer

This repo is the source for the **the-developer Cursor Plugin** (see [PLUGIN.md](PLUGIN.md) and `.cursor-plugin/plugin.json`).

When working **inside this repo**, project `.cursor/` still applies. When the plugin is installed, components load from the plugin package (`rules/`, `skills/`, …).

This companion combines:

- **[Spec Kit](https://github.com/github/spec-kit)** — spec-driven features
- **[Ponytail](https://github.com/DietrichGebert/ponytail)** — lazy-senior minimalism
- **[CodeGraph](https://github.com/colbymchenry/codegraph)** — local code knowledge graph + MCP

## Route every request

1. **Structural explore / “how does X work”** → MCP `codegraph_explore` first (not grep/Read loops). Hooks keep the index synced.

2. **Feature / multi-step delivery** → Spec Kit skills in order. Do **not** invent a parallel pipeline.

   ```text
   /speckit-constitution   # if constitution not yet ratified / still placeholders
   /speckit-specify
   /speckit-plan           # after clarify if needed
   /speckit-tasks
   /speckit-implement
   /speckit-converge
   ```

   Optional: `/speckit-clarify`, `/speckit-checklist`, `/speckit-analyze`.
   While implementing: Ponytail ladder + CodeGraph for navigation.
   **Prototype first** for every change request (see item 15) before implement.

3. **Correctness / security review** → `.cursor/skills/code-review/SKILL.md`

4. **Over-engineering / delete-list** → `/ponytail-review` (or `/ponytail-audit`)

5. **Quick bug** → `.cursor/skills/debug/SKILL.md`

6. **Commit** → `.cursor/skills/commit/SKILL.md`

7. **Tiny fix / explain** → direct coding under standards + Ponytail; skip Spec Kit

8. **Frontend / UI design or update (required)** → `.cursor/skills/hallmark/SKILL.md` ([hallmark](https://github.com/nutlope/hallmark)) **must** load for any new UI, landing, or frontend visual update. Pair with `.cursor/skills/frontend-design/SKILL.md` and MCP `inspo` ([inspomcp.dev](https://inspomcp.dev/)) for real-site references.

9. **Grill / stress-test a plan or design** → `/grill-me` → load `.cursor/skills/grilling/SKILL.md` ([mattpocock/skills](https://www.skills.sh/mattpocock/skills/grill-me)). Do this before Spec Kit implement when the plan needs hardening.

10. **Browser testing / QA / dogfooding** → `/agent-browser` → then run `agent-browser skills get core` (and `dogfood` for exploratory QA) before any browser commands ([vercel-labs/agent-browser](https://www.skills.sh/vercel-labs/agent-browser/agent-browser)). Prefer agent-browser over built-in browser tools for web app testing.

11. **React / Next.js performance** → `.cursor/skills/vercel-react-best-practices/SKILL.md` ([vercel-react-best-practices](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)) when writing, reviewing, or refactoring React/Next code.

12. **Module / seam / deep-module design** → `.cursor/skills/codebase-design/SKILL.md` ([codebase-design](https://www.skills.sh/mattpocock/skills/codebase-design)).

13. **Hard bugs** → `.cursor/skills/diagnosing-bugs/SKILL.md` ([diagnosing-bugs](https://www.skills.sh/mattpocock/skills/diagnosing-bugs)) — prefer over the quick `debug` skill when the bug needs a feedback loop / bisection.

14. **Test-first / red-green-refactor** → `.cursor/skills/tdd/SKILL.md` ([tdd](https://www.skills.sh/mattpocock/skills/tdd)). Confirm seams with the user before writing tests.

15. **Every change request → prototype first** → `.cursor/skills/prototype/SKILL.md` ([prototype](https://www.skills.sh/mattpocock/skills/prototype)). Build a throwaway LOGIC or UI prototype, get a verdict, then implement. Skip only if the user says so, or the ask is docs/typo/review/commit/explain with no behavior or UI change.

16. **Conversation → spec/PRD** → `.cursor/skills/to-spec/SKILL.md` ([to-spec](https://www.skills.sh/mattpocock/skills/to-spec); formerly listed as [to-prd](https://www.skills.sh/mattpocock/skills/to-prd)). Synthesize a spec and publish to the issue tracker — no interview.

17. **End-user demo video** → `.cursor/skills/hyperframes-demo/SKILL.md`. Use HyperFrames CLI to prepare a short shareable demo; preview before render.

18. **Document → full meaning / insights** → `.cursor/skills/extract-meaning-full-insight/SKILL.md`. Take the document from the user (attach / paste / path); produce the insight pack.

19. **Document → flowchart** → `.cursor/skills/document-to-flowchart/SKILL.md`. Take the document from the user; emit a Mermaid flowchart + legend.

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
- Do not skip Spec Kit stages unless the user asks.
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
- **Companion** — `code-review`, `debug`, `commit`, `frontend-design`, `hallmark`, `grill-me` / `grilling`, `vercel-react-best-practices`, `codebase-design`, `diagnosing-bugs`, `tdd`, `prototype`, `to-spec`, `hyperframes-demo`, `extract-meaning-full-insight`, `document-to-flowchart`
- **HyperFrames demos** — `hyperframes-demo` (+ personal `/hyperframes` / `/hyperframes-cli` skills when present)
