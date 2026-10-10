# Checkpoint convergence

Use this alongside the spec workflow. A large specification is not a substitute for reading the relevant original code, designs or product reference. Implement one small slice at a time and keep the accepted architecture documented in `.specs/architecture.md`.

The checkpoint CLI requires Git and runs at the project repository root. It does not launch AI agents. The host assistant creates tests, captures images and obtains actual independent reviews. Running the same session twice under different names is not independence.

## 1. Plan small checkpoints

Fill the architecture document, choose a focused reference, then register a short checkpoint. Source and test paths are comma-separated; references must be local focused files up to 1 MiB. Include the documented architecture among references so changes to standards invalidate results.

```bash
the-developer checkpoint add 001-auth cp-001 \
  --title="Login form skeleton" --author=frontend-implementer \
  --scope=src/login,tests/login \
  --reference=docs/login-reference.md,.specs/architecture.md
```

Register later checkpoints in the same way. They may be planned ahead, but cannot run until their predecessors complete. Use `--logic-only` for a checkpoint with no UI; its visual gate becomes not applicable.

## 2. Prove behavior

A test-designer reads the reference directly and creates user-perspective integration tests, including error and permission cases. Copy `.developer/templates/checkpoint-cases.json` into the feature directory and replace placeholders with real executable cases:

```json
{
  "cases": [
    { "id": "login-validation", "command": "npm", "args": ["run", "test:login"], "cwd": ".", "timeoutMs": 30000 }
  ]
}
```

```bash
the-developer checkpoint run 001-auth cp-001 --checks=.specs/features/001-auth/cases.json
the-developer checkpoint status 001-auth cp-001
```

Each listed case must execute successfully. An empty manifest is rejected; nonzero exits, launch errors and timeouts fail the gate. Commands run without shell evaluation. Outputs are suppressed rather than archived because they may contain credentials. Recordings contain IDs, exit codes, timings, the source/reference revision and config hash. Never put secrets in command arguments or evidence.

This is a generic command runner: it cannot discover whether `npm test` ran zero tests or whether a trivial command tests anything. Review actual assertions and runner results. A failed case must be fixed rather than deleted to obtain a passing verdict. Case IDs become required after a run; subsequent manifests cannot drop them. A genuine scope change needs a new checkpoint.

## 3. Review the matching UI state

For UI checkpoints, a visual-reviewer compares only the built section. Capture reference and implementation at the same viewport, data and interaction state. Create an evidence JSON file with the current revision printed by `status`:

```json
{
  "checkpoint": "cp-001",
  "revision": "REPLACE_WITH_CURRENT_REVISION",
  "reviewer": "visual-reviewer-session-1",
  "verdict": "passed",
  "scope": ["navigation and login form"],
  "referenceState": "empty form, desktop viewport",
  "implementationState": "empty form, desktop viewport",
  "referenceScreenshot": "evidence/reference.png",
  "implementationScreenshot": "evidence/implementation.png",
  "findings": [],
  "note": "Matched state and all scoped differences resolved"
}
```

```bash
the-developer checkpoint review 001-auth cp-001 --gate=visual --evidence=evidence/visual.json
```

Different state descriptions force an invalid verdict, even if the submitted verdict says passed. Every open finding blocks a pass. Findings contain `location`, `severity` (low/medium/high/critical), `detail`, and `status` (open/fixed). Captures are archived with hashes. The CLI checks the evidence structure, not the image's semantic equivalence or whether state descriptions are truthful.

## 4. Obtain two independent code reviews

Use `code-reviewer-a` and `code-reviewer-b` in distinct fresh contexts. Neither should see implementer reasoning or the other reviewer's initial conclusions. Both inspect the scoped diff against documented standards, challenge assumptions and re-review every fix. Their reports use this shape:

```json
{
  "checkpoint": "cp-001",
  "revision": "REPLACE_WITH_CURRENT_REVISION",
  "reviewer": "code-reviewer-a-session-1",
  "contextIsolated": true,
  "standards": [".specs/architecture.md"],
  "verdict": "passed",
  "findings": [],
  "note": "Architecture and behavior reviewed against project standards"
}
```

```bash
the-developer checkpoint review 001-auth cp-001 --gate=review-a --evidence=evidence/review-a.json
the-developer checkpoint review 001-auth cp-001 --gate=review-b --evidence=evidence/review-b.json
```

Both reviews require behavior and applicable visuals first; they can evaluate the same revision independently in parallel. Their CLI recordings serialize through a feature lock. Reviewer identities must differ from the implementer and each other. Architecture standards must be concrete files included among the references. Identity and context isolation are declared by the operator, not authenticated by this CLI.

Any source, reference or behavior-manifest change makes prior gates pending. Fixes require behavior, applicable UI and both code reviews again. Old artifacts remain archived; they do not satisfy the current revision.

## 5. Engineer approval, commit, completion

An engineer inspects the scoped code and running behavior. Record approval only after it actually occurs:

```bash
the-developer checkpoint approve 001-auth cp-001 --by=engineer-name --note="Approved this revision after reviewing the behavior and diff"
```

If the engineer rejects the result, record that feedback with `checkpoint reject 001-auth cp-001 --by=engineer --note="..."`. The rejection is remembered and blocks completion at that revision even under autonomous policy. Address the feedback, rerun technical gates for any code changes, then obtain approval or continue under an authorized policy.

Re-recording behavior clears later visual/code/engineer approvals; re-recording visual review clears later code/engineer approvals. Either independent code review clears engineer approval but preserves the other code review at the same revision.

Commit the scoped implementation using your normal Git workflow, then name that actual commit:

```bash
the-developer checkpoint complete 001-auth cp-001 --commit=ACTUAL_COMMIT_SHA
```

Completion rejects missing/stale gates, altered archived evidence and commits whose scoped code differs from the reviewed working tree. It does not create a commit, stage unrelated files or push. The completion bookkeeping is written after the implementation commit; include it in a later bookkeeping commit as needed. Later checkpoints may now start.

## Autonomy and memory

Manual approval is the default. Only after an engineer explicitly authorizes autonomous operation for this feature, record the policy:

```bash
the-developer checkpoint policy 001-auth --approval=autonomous --by=engineer-name
```

Technical gates remain mandatory. Restore manual approval with `--approval=manual`. Policies are auditable declarations, not authentication or deployment authorization.

State lives in `checkpoints.json`, feedback in `memory.json`, and immutable-by-convention artifacts under `checkpoints/<id>/evidence/` within the feature directory. Read accepted engineer feedback and passing reviews before the next slice. Failed/invalid findings are unresolved work, not new architecture rules. Memory never relaxes gates or overrides project instructions. Git can archive these files; they are not automatically ignored because they are useful review evidence.

Source/reference fingerprints invalidate current gate results. Completed checkpoints retain their accepted verdicts and commit; later changes belong to a new checkpoint. Concurrent mutations use `checkpoints.lock`; remove a stale lock only after confirming its command is no longer running. Local JSON and hashes can be edited, so this is workflow enforcement for cooperative operators, not tamper-proof access control.
