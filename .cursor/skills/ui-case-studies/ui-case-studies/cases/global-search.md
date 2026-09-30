# Case study — Global search (cmd-K / omnibox)

Sources: [SaaS UI workflow](https://gist.github.com/camillanapoles/573f1dd3559459fa37bbe52e6ff33fc1) (global search → preview → full page).

## Job

Jump anywhere fast — people, projects, settings, docs — from one palette.

## Default content

1. **Input** — placeholder naming scopes (“Search projects, people, settings…”)
2. **Grouped results** — by type with icons
3. **Preview** (optional) — right pane snippet
4. **Keyboard** — ↑↓ select, Enter open, Esc close; shortcut hinted in UI
5. **Footer hints** — filters (`#`, `@`) if supported
6. **Empty / no results** — neutral ([search-results](search-results.md))

## Defaults

- Recent / suggested when query empty
- Debounced query; loading indicator
- Respect permissions (don’t show forbidden hits)

## Anti-patterns

- Search that only finds docs, advertised as “everything”
- No keyboard path
- Results without type grouping when mixed entities

## Checklist

- [ ] Shortcut + open field
- [ ] Grouped results + open target
- [ ] Empty and no-results states
