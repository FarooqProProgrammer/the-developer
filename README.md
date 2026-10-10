# the-developer

A full-stack development toolkit with 13 engineering and design skills, 13 agent roles, six workflow stages, and configurable lifecycle checks. No runtime npm dependencies; Node.js 18 or newer is required.

## Install everything with one command

Run from the project you want to equip:

```bash
npx github:FarooqProProgrammer/the-developer install --all
```

Or provide a project directory:

```bash
npx github:FarooqProProgrammer/the-developer install ./my-project --all
```

This installs skills, assistant-specific agent definitions, workflow commands, templates, and hook configuration where supported. It does not start agent processes, install a web framework, or require AI provider credentials.

From a checkout of this repository:

```bash
node /path/to/the-developer/bin/cli.mjs install ./my-project --all
```

Use `--dry-run` to preview without writing, `--target=claude,codex` to select hosts, or `--preset=frontend` for the original six design skills. `install` defaults to the full-stack preset and Antigravity target. `init` retains the frontend preset by default; use `init --preset=fullstack --all` for the complete toolkit.

Existing settings and hooks are merged additively. A manifest records generated files so unchanged managed files can be refreshed. Modified files are protected: conflicts stop installation before writes. No force-overwrite mode is provided. Existing conflicting Codex role tables require manual reconciliation. Back up project configuration before upgrading; this is a file installer, not a filesystem transaction across disk failures.

## Assistant adapters

| Target | Skills | Agent definitions | Workflow entry points | Checks |
| --- | --- | --- | --- | --- |
| Claude Code | `.claude/skills/` | `.claude/agents/*.md`, inherited model | `.claude/commands/` and workflow skills | Stop hook in `.claude/settings.json` |
| Cursor | `.cursor/skills/` | `.cursor/agents/*.md` | `.cursor/commands/` and workflow skills | Advisory stop hook in `.cursor/hooks.json` |
| GitHub Copilot | `.github/skills/` | `.github/agents/*.agent.md` | `.github/prompts/*.prompt.md` | Session-end hook in `.github/hooks/the-developer.json` (CLI/cloud agent) |
| Codex | `.agents/skills/` | `.codex/agents/*.toml`, registered in `.codex/config.toml` | Workflow skills | Stop hook in current Codex configuration |
| Windsurf | `.windsurf/skills/` | Role workflows in `.windsurf/workflows/` | `.windsurf/workflows/` | Shared runner, manual or CI |
| Antigravity | `.agents/skills/` | Role workflows in `.agents/workflows/` | `.agents/workflows/` | Shared runner, manual or CI |

Each platform gets its own definitions generated from the canonical roles in `workflows/agents/`. Installed canonical copies live in `.developer/agents/`. The installer does not treat every assistant as if it has the same subagent API. Windsurf and Antigravity receive sequential role workflows; Copilot receives custom profiles whose delegation capabilities depend on the host.

Reload your assistant after installation and trust the project only after reviewing configuration. Host versions, policies, and trust settings can disable agent discovery or hooks. Codex hooks require a version supporting lifecycle hooks; older clients may need the generated `hooks.Stop` table removed. The adapter files are tested by this repository, but live assistant execution is not covered by the CLI test suite.

Run `the-developer targets` to display capabilities. See `.developer/INSTALLATION.md` in the installed project for local instructions.

## Skills

The full-stack preset contains these 13 skills, plus six workflow skills:

| Area | Skills |
| --- | --- |
| Full-stack engineering | `fullstack-development`, `backend-development`, `database-migrations`, `api-contracts` |
| Verification and delivery | `quality-assurance`, `security-review`, `devops-delivery` |
| Frontend design | `css-design-tokens`, `frontend-designer`, `hallmark`, `micro-animation-interaction`, `scroll-craft`, `tailwindcss` |

Use `the-developer list` and `the-developer info backend-development` to inspect bundled instructions. Skills guide the assistant; they do not install their subject's runtime dependencies.

## Agent hierarchy

```text
orchestrator
  product-analyst -> architect
    frontend-developer + backend-developer
    database-engineer (when persistence changes)
  test-designer -> executable behavior cases
  visual-reviewer -> matched-state UI review (when applicable)
  code-reviewer-a + code-reviewer-b -> independent adversarial reviews
  qa-engineer -> integrated review
  security-reviewer (when trust boundaries change)
  devops-engineer (when runtime or delivery changes)
```

Every role defines purpose, inputs, file ownership, deliverables, completion criteria, and handoff rules. The orchestrator selects only the roles needed, agrees on contracts before parallel work, prevents overlapping file ownership, and verifies the integrated result. Small fixes may use a short sequential plan. Project permissions still govern whether delegation is allowed.

## Spec-driven workflow

`Idea -> specify -> plan -> tasks -> implement -> verify -> review`

```bash
the-developer specify 001-user-auth --project=./my-project
the-developer plan 001-user-auth --project=./my-project
the-developer tasks 001-user-auth --project=./my-project
the-developer verify 001-user-auth --project=./my-project
```

After each scaffold stage, fill in the generated document before moving forward. The CLI creates templates; it does not call an AI provider or generate architecture decisions. Use the installed `developer-implement` and `developer-review` workflows in your assistant for implementation and review.

```text
.developer/
  agents/                  # Canonical role instructions
  workflows/               # Six stages
  templates/               # Reusable spec, plan, tasks and evidence templates
  hooks/check.mjs           # Shared check runner
  checks.json              # Your project-specific checks
  manifest.json            # Managed-file hashes
  INSTALLATION.md          # Adapter and runtime guidance
.specs/
  constitution.md          # Project standards and coordination
  WORKFLOW.md               # Entry instructions
  features/001-user-auth/
    spec.md
    plan.md
    tasks.md
    verification.md
```

`verify` checks documents for missing files, draft markers, placeholders, and failed/unrun outcome rows. It does **not** run application tests, confirm evidence is true, or grant approval. Record real commands and results in `verification.md` and review them separately. The workflow is inspired by spec-driven development; it is not a bundled installation of GitHub Spec Kit.

## Helix-inspired checkpoints and gates

The [Shopify Helix article](https://shopify.engineering/helix) explains why small, reviewed checkpoints converge more reliably than one large generated implementation. This toolkit now applies that loop to full-stack work:

1. Define a small checkpoint with direct reference files and documented architecture.
2. Run executable user-behavior cases, including edge cases.
3. For UI work, review matched reference/implementation screenshots within the built scope. Mismatched states are invalid.
4. Obtain two independent, context-isolated code reviews; every open finding blocks a pass.
5. Record actual engineer approval, commit the reviewed code, and complete the checkpoint before starting the next.

```bash
the-developer checkpoint add 001-auth cp-001 \
  --title="Login validation" --author=backend-implementer \
  --scope=src/auth,tests/auth \
  --reference=docs/auth-reference.md,.specs/architecture.md --logic-only

the-developer checkpoint run 001-auth cp-001 --checks=.specs/features/001-auth/cases.json
the-developer checkpoint status 001-auth cp-001
```

Import review evidence with `checkpoint review --gate=visual|review-a|review-b --evidence=path.json`. Use `checkpoint approve --by=engineer --note="..."` only after actual approval. `checkpoint complete --commit=SHA` requires all applicable gates and a commit matching the reviewed code. Source, reference and behavior-manifest changes invalidate existing results. Evidence and review feedback are archived per feature.

Manual engineer approval is the default. An engineer can explicitly authorize `checkpoint policy 001-auth --approval=autonomous --by=engineer`; it waives only engineer approval, never the technical gates. Logic-only checkpoints skip only visual review. Different reviewer names are not proof of independent contexts; host assistants must provide real isolation. The CLI does not launch models or authenticate identities.

Fill `.specs/architecture.md` with your project's standards. Full command examples, evidence schemas, memory behavior and limitations are in [CHECKPOINTS.md](workflows/CHECKPOINTS.md); the installer copies it into `.developer/`. [HELIX-NOTES.md](workflows/HELIX-NOTES.md) maps the article's ideas to the implementation and explains what is not automated.

## Hooks and checks

Edit `.developer/checks.json` to select actual project checks:

```json
{
  "commands": [
    { "command": "npm", "args": ["test"], "cwd": ".", "timeoutMs": 30000 }
  ]
}
```

The initial list is empty because the installer cannot infer a trustworthy test command for every project. Empty checks do no work and do not establish readiness. Execute manually or from CI:

```bash
node .developer/hooks/check.mjs
```

The runner uses argument arrays without shell evaluation, restricts working directories to the project, and limits the total check time to 45 seconds. It suppresses subprocess output to avoid leaking credentials; rerun a failed command manually to diagnose it. Review commands before enabling them.

Claude and current Codex Stop hooks report failures with exit code 2. A repeated stop-hook invocation exits without reblocking. Cursor stop hooks report failures on stderr but do not trigger automatic follow-up loops. Copilot CLI/cloud agent runs checks on session end and reports failures without a completion gate; IDE hook support varies. Windsurf and Antigravity receive the same runner for manual/CI invocation. No Git hooks are installed or existing user hooks removed.

## Development

```bash
npm test
node bin/cli.mjs install /tmp/example-project --all --dry-run
npm pack --dry-run
```

Tests cover adapters, all-target installation, repeatability, conflict protection, hook behavior, feature scaffolding, checkpoint ordering, gate failures, stale evidence, independent reviews, feedback memory, and the packaged CLI. The toolkit has no dependency-install or build step.

## Optional MCP integrations

`the-developer mcp` prints suggested Inspo, Stitch, Mobbin and shadcn configurations. These integrations are optional and are not registered by the installer. Configure credentials securely in your assistant; never commit secret values.

## Adapter references

- [Claude subagents](https://code.claude.com/docs/en/sub-agents) and [hooks](https://code.claude.com/docs/en/hooks)
- [Cursor subagents](https://cursor.com/docs/context/subagents) and [hooks](https://cursor.com/docs/agent/hooks)
- [Copilot agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Copilot hooks](https://docs.github.com/en/copilot/reference/hooks-reference)
- [Codex configuration schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json)
- [Windsurf workflows](https://docs.windsurf.com/windsurf/cascade/workflows)

MIT © Farooq.
