<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0
- Modified principles: IV expanded for CodeGraph navigation
- Added sections: none (CodeGraph in Development Workflow)
- Removed sections: none
- Follow-up TODOs: none
-->
# the-developer Constitution

## Core Principles

### I. Clarity Over Cleverness

Readable, explicit code MUST win over clever abstractions. Prefer names and structure that
a new contributor can follow without tribal knowledge. Complexity MUST be justified in the
plan or a short comment when non-obvious.

### II. Smallest Viable Change (Ponytail)

Deliver the smallest change that satisfies the active specification or user request.
Before writing code, stop at the first rung that holds (after reading the problem and
tracing the real flow):

1. Does this need to exist? → skip (YAGNI)
2. Already in this codebase? → reuse
3. Stdlib? → use it
4. Native platform feature? → use it
5. Already-installed dependency? → use it
6. One line? → one line
7. Only then: the minimum that works

Do NOT expand scope with drive-by refactors, speculative features, unrelated cleanup,
or new dependencies when a few lines suffice. Do NOT cut trust-boundary validation,
data-loss handling, security, accessibility, or anything the user explicitly requested.

### III. Spec Before Code

Non-trivial features MUST go through Spec Kit SDD
(`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement` → `/speckit-converge`)
before substantial implementation. Tiny fixes, explanations, and one-file changes MAY skip
the pipeline. Do NOT invent a parallel custom Speckit pipeline.

### IV. Verify With Project Tooling

When the repository already defines test, lint, or typecheck commands, behavior changes
MUST be verified with those tools when practical. Do NOT invent a new test stack unless
the project has none and the user asks for one.

When CodeGraph is initialized (`.codegraph/`), structural navigation MUST prefer
`codegraph_explore` over grep/Read loops. Cursor hooks MUST keep the graph synced on
session start, file reads, and file edits (fail-open if the CLI is unavailable).

### V. Safety Before Speed

Do NOT commit secrets, credentials, or private keys. Do NOT commit, push, amend, or run
destructive git/ops actions unless the user explicitly asks. Ask before irreversible work.

### VI. Stack From Context

Never invent a technology stack. Infer language, framework, and layout from the user
request and existing repository files. If neither is clear, ask once before specifying
or planning.

## Stack Neutrality

This kit is stack-agnostic. Templates and companion skills MUST remain usable across
languages and frameworks. Project-specific stack choices belong in each feature's
`plan.md` and the codebase itself, not in this constitution.

## Development Workflow

1. Classify intent: Spec Kit SDD, CodeGraph explore, Ponytail review/audit, companion, or direct coding.
2. For features: follow Spec Kit skills in order; implement under the Ponytail ladder.
3. Ponytail is active via `.cursor/hooks.json` (not `.cursor/rules/ponytail.mdc`).
4. CodeGraph syncs via `.cursor/hooks/codegraph-sync.js` on `sessionStart`, `beforeReadFile`, `afterFileEdit`.
5. For correctness reviews and quick bugs: use companion skills under `.cursor/skills/`.
6. Respect `AGENTS.md` and `.cursor/rules/` for routing and everyday standards.

## Governance

- This constitution supersedes informal habits when they conflict.
- Amendments update `.specify/memory/constitution.md`, bump the version (MAJOR for
  incompatible principle changes, MINOR for new principles/sections, PATCH for
  clarifications), and set Last Amended to the amendment date.
- Spec Kit plan and implement steps MUST check compliance with these principles.
- Runtime agent guidance lives in `AGENTS.md` and `.cursor/rules/`; those MUST stay
  consistent with this constitution.
- Ponytail source of truth for ladder wording lives in `vendor/ponytail/`; keep kit
  docs aligned when upgrading the vendor checkout.

**Version**: 1.2.0 | **Ratified**: 2026-09-30 | **Last Amended**: 2026-09-30
