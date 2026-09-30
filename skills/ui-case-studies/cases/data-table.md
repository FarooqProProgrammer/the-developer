# Case study — Data table / list view

Sources: [SaaSUI data table patterns](https://www.saasui.design/blog/saas-data-table-ux-patterns), [SaaS UI workflow gist](https://gist.github.com/camillanapoles/573f1dd3559459fa37bbe52e6ff33fc1).

## Job

Scan many records with shared fields — compare, sort, filter, act on one or many.

## Default chrome

1. **Toolbar** — search, filters, view switch (table/board/cards), primary Create
2. **Column headers** — sort indicator (active column + direction)
3. **Rows** — key fields only; overflow for secondary
4. **Selection** — row checkbox + select-all
5. **Bulk action bar** — appears when selection > 0 (export, tag, delete…)
6. **Row actions** — 1–2 visible + ⋮ menu (open, edit, archive, delete)
7. **Pagination** or “Load more” / virtual scroll affordance
8. **Sticky header** on long lists

## Content defaults

| Area | Expected |
|------|----------|
| Density | Comfortable default; compact optional |
| Empty | First-run vs no-results ([search-results](search-results.md), [empty-state](empty-state.md)) |
| Destructive | Confirm or undo — not silent delete |

## When not to use a table

- Status pipeline → prefer board/kanban
- Visual/rich objects → card grid
- Single record → detail page

## Anti-patterns

- Every field as a column
- Bulk bar always visible with nothing selected
- Sort with no active-column indicator

## Checklist

- [ ] Sort + filter + search exist if list is large
- [ ] Selection ↔ bulk actions connected
- [ ] Row open/edit path clear
