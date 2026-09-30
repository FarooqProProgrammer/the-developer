# Case study — Search & filter results

Sources: [Northbase empty states](https://www.northbase.design/patterns/empty-states), [Supabase empty states](https://supabase.com/design-system/docs/ui-patterns/empty-states), [Stripe empty states](https://docs.stripe.com/stripe-apps/patterns/empty-state).

## Job

Help users find items — and recover when nothing matches.

## Default content (has results)

- Result count (“12 results”)
- Result list/cards with key fields
- Active filters as chips (dismissible)
- Sort control when order matters
- Pagination or infinite scroll affordance

## Zero results (search/filter) — defaults

| Element | Guidance |
|---------|----------|
| Tone | **Neutral** — not celebratory, not “Don’t worry!” |
| Headline | Short: “No results” / “No results for ‘{query}’” (2–4 words + query) |
| Body | Suggest adjust query / clear filters |
| CTA | “Clear filters” / “Clear search” — primary recovery |
| Chrome | Keep table headers / filter bar visible (esp. data grids) |
| Illustration | Usually **none** for search zero-results |

## Distinguish states

- **First-run empty** → create CTA ([empty-state](empty-state.md))
- **No results** → clear filters (this page)
- **Error** → retry / go home — not an empty state
- **No permission** → request access — not “no data”

## Anti-patterns

- Encouraging copy mid-search (“Keep exploring!”)
- Upselling unrelated features in no-results
- Removing columns when the grid is empty
- Same message for “never had data” and “filters too tight”

## Checklist

- [ ] Query echoed in no-results when possible
- [ ] One-click clear filters/search
- [ ] Loading → error → empty → content order respected
