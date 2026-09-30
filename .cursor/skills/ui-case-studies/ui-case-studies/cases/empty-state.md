# Case study — Empty / first-run state

## Job

When there is **no data yet**, explain why the space is empty and give **one** clear next action.

## Distinguish empty flavors

(See also [search-results](search-results.md), [notifications-inbox](notifications-inbox.md).)

| Flavor | Tone | CTA |
|--------|------|-----|
| First-run / no data yet | Neutral + “yet” | Create / import |
| Zero search/filter results | Neutral, short | Clear filters |
| Inbox caught up | Celebratory OK | Optional browse |
| Error | Not an empty state | Retry |

## Default content

1. **Illustration or icon** (optional; skip for search zero-results)
2. **Headline** — what’s missing (“No projects yet”)
3. **One sentence** — why it matters / what happens next
4. **Primary CTA** — create / import / connect
5. **Secondary** (optional) — docs, sample data, skip

## Defaults

- Prefer create over browse when the product is authoring-first
- Sample/demo data only if it can be deleted easily
- Don’t show a full data table with zero rows and no CTA
- Keep table headers on data-heavy zero-result grids ([Supabase](https://supabase.com/design-system/docs/ui-patterns/empty-states))

## Anti-patterns

- Blank white page
- Error styling for a normal empty state
- Five competing CTAs
- Lorem ipsum
- Celebratory copy on first-run emptiness
