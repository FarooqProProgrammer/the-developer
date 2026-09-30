# Case study — Kanban / board

Sources: [SaaSUI data table](https://www.saasui.design/blog/saas-data-table-ux-patterns) (when board beats table).

## Job

Move work through **stages** — status as columns, cards as items.

## Default chrome

1. **Columns** — stage name + count
2. **Cards** — title, key meta (assignee, due, tags)
3. **Add card** / **Add column** (if flexible workflow)
4. **Filters** — assignee, label, search
5. **Card detail** — drawer or page ([list-detail](list-detail.md))
6. Optional WIP limits + warning

## Defaults

- Drag between columns updates status; also offer menu move (a11y/keyboard)
- Persist column order
- Empty column still shows drop target + “Add”

## Anti-patterns

- Board used as a dump for non-status data (use table)
- No card open/detail
- Silent failed drag (permission)

## Checklist

- [ ] Columns + cards + open detail
- [ ] Filter/search
- [ ] Non-drag alternative to change status
