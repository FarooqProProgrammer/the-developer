# Case study — 404 / not found

Sources: [Prism empty/access patterns](https://prism-design.supernova-docs.io/latest/patterns/system-behavior/empty-states-9pR3nPit), [Supabase missing routes](https://supabase.com/design-system/docs/ui-patterns/empty-states).

## Job

Tell the user this URL/resource doesn’t exist (or no longer does) and give a way out.

## Default content

1. Clear title — “Page not found” / “Not found”
2. Short explanation — link may be wrong or item deleted
3. **Primary CTA** — Go home / Go back
4. **Secondary** — Search, docs, contact support (optional)
5. Product chrome — keep nav so they’re not trapped

## Dynamic resource missing (e.g. `/project/bad-id`)

- Prefer “Project not found” over generic 404 when you know the type
- Don’t leak whether an ID exists if that’s a security concern (use generic not-found)

## Defaults

- HTTP 404 for unknown routes; in-app soft not-found for missing entities
- Log/monitor; don’t joke so hard that support can’t find the page

## Anti-patterns

- Blank crash page
- Only a meme with no navigation
- Treating permission denied as 404 without a distinct path when you can safely say “no access”

## Checklist

- [ ] Home + back recovery
- [ ] Nav still available
- [ ] Copy matches entity type when safe
