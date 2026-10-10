# What we adopted from Helix

Source: [Shopify Engineering: Helix](https://shopify.engineering/helix), Talha Naqvi, updated September 21, 2026. Reviewed using article text supplied by the user.

Helix is Shopify's internal tooling for native mobile migrations. Its transferable idea is reliable convergence: small attempts are allowed to fail, but unproven work cannot advance. This toolkit applies that idea to full-stack features and refactors without assuming Shopify's Swift/Kotlin architecture or model choices.

| Helix idea | Implementation here |
| --- | --- |
| Small ordered checkpoints | Short titles, explicit source/test scopes, one active checkpoint per feature |
| Reference is the spec | Focused reference paths; reference changes invalidate evidence; behavior attempts archive reference snapshots |
| Behavior before visual review | Actual executable cases, nonzero/timeout failures block progress |
| Matched-state visual comparison | Explicit built-section scope, reference and implementation states, archived captures; mismatches become invalid |
| Two isolated adversarial reviews | Separate reviewer roles and identities, isolation declaration, documented standards, all open findings block approval |
| Engineer closes the loop | Manual approval by default, feedback memory, a real implementation commit before completion |
| Autonomy without weaker gates | Explicit per-feature autonomous policy waives only engineer approval |
| Feedback improves later work | Append review and engineer feedback with verdict and evidence pointers to feature memory |

The CLI does not generate tests, capture screenshots, launch models, authenticate identities, or prove a reviewer used a fresh context. Host assistants and engineers perform those tasks and submit evidence. Reviewer names and isolation are declarations, not cryptographic authentication. Editable local state is an orchestration record, not a security boundary.

Visual review is qualitative and scoped; an image hash proves archive integrity, not visual correctness. Generic commands cannot prove a test suite exercised nontrivial behavior or reported a nonzero test count; choose assertion-based cases and review their adequacy. Production deployments remain separately authorized.
