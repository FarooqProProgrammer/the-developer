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
