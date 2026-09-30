# Case study — Multi-step form / wizard

Sources: [Stepper UI best practices](https://foundey.com/blog/stepper-ui-best-practices).

## Job

Break a long configuration into labeled stages with clear progress and backtracking.

## Default content

1. **Named steps** — “Connect calendar”, not only “Step 2”
2. **Step N of M** or labeled progress
3. **Current step body** — fields for this stage only
4. **Secondary help** — why this step matters (sidebar or inline)
5. **Nav** — Back, Continue/Next, optional Skip
6. **Review step** (for high stakes) before final submit

## Defaults

- Persist draft between steps
- Validate per step before advancing
- Allow Back without wiping later steps’ data until submit rules say otherwise
- Mobile: vertical stepper or compact “N of M”

## Anti-patterns

- Unlabeled numeric-only steps
- No way back
- One giant page pretending to be a wizard with fake steps
- Final submit with no review on payments/permissions

## Checklist

- [ ] Every step has a human label
- [ ] Back + Continue work
- [ ] Draft persistence or clear “progress lost” warning
