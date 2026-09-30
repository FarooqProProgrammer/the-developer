# Case study — Audit log / activity history

Sources: collaboration/admin patterns (audit timeline, version history).

## Job

Show **who did what, when** for security, support, and compliance — readable, filterable, exportable.

## Default blocks

1. **Filters** — actor, action type, date range, target object
2. **Timeline / table** — timestamp, actor, action, object, IP/device (if relevant)
3. **Row expand** — before/after or metadata JSON (collapsed by default)
4. **Export** — CSV when compliance needs it
5. **Empty** — “No activity yet” vs no-results for filters

## Content per entry

- Actor (user/system/API key name)
- Verb + object (“updated billing email on Workspace X”)
- Time in user timezone
- Optional correlation / request id

## Defaults

- Immutable (no edit/delete of log entries in UI)
- Newest first
- Retain/copy policy linked in help text if regulated

## Anti-patterns

- Raw dumps with no human verb
- Client-only “history” that clears on refresh for security events
- PII in logs without redaction policy

## Checklist

- [ ] Filter + readable action line
- [ ] Expand for detail
- [ ] Export if product promises compliance
