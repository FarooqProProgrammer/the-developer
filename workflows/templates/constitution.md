# Project constitution

## Engineering standards
- Follow repository instructions and established architecture.
- Keep business logic separate from transport and presentation.
- Validate inputs at trust boundaries; enforce authorization on the server.
- Define API schemas, error semantics and data ownership before parallel implementation.
- Maintain accessible UI and explicit loading, error and empty states.
- Never commit credentials or log secret values.
- Choose relevant tests; preserve passing, failing, skipped and unrun outcomes.
- Require authorization for production deployment and destructive migrations.

## Workflow
Idea -> specification -> technical plan -> tasks -> implementation -> verification -> review.
Small fixes may use a concise plan and relevant checks. Larger features use the full feature directory.

## Coordination
One integration owner and one owner per file. Run roles sequentially unless the host supports delegation and instructions permit it. Use existing checkouts; do not create worktrees unless requested.

## Project decisions
Record stack, build/test commands, data store, deployment target and conventions here before implementation.

## Checkpoint standards
Work in small ordered checkpoints, with direct references and documented architecture. Each checkpoint must pass behavior, applicable matched-state visual review, two independent isolated code reviews, and engineer approval before completion. Failed or invalid gates cannot be waived as "good enough". Source/reference changes invalidate existing evidence.

Logic-only checkpoints omit the visual gate. Engineer-authorized autonomous mode waives only engineer approval; technical gates remain mandatory. Record accepted feedback and archive evidence. A completed checkpoint names its real implementation commit. Reviewer identity and isolation declarations must reflect actual execution, not merely different role names.
