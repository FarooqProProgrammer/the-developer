---
name: code-review
description: CLI + manual code review (ESLint, React Doctor, CodeRabbit, tsc)
---

Load and follow the `code-review` skill.

1. Detect stack and scope (diff / branch / PR).
2. Run applicable CLIs: ESLint → `tsc --noEmit` → Prettier check → React Doctor (`-y --json`, prefer `--scope changed`) → `coderabbit review --agent` if installed.
3. Manual correctness/security pass; merge findings by severity.
4. For install of CodeRabbit or React Doctor CI/agent hooks, follow `skills/code-review/INSTALL.md` and ask first.

Prefer `/ponytail-review` if the ask is only over-engineering.
