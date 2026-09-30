# Case study — Calendar / scheduling

Sources: [SaaS UI workflow](https://gist.github.com/camillanapoles/573f1dd3559459fa37bbe52e6ff33fc1) (time-off / booking patterns).

## Job

Show time-based items; create/reschedule with conflict awareness.

## Default chrome

1. **View switch** — Month / Week / Day / Agenda (what the product needs)
2. **Date navigation** — today, prev/next, jump-to-date
3. **Events** — title, time range, color/category
4. **Create** — click slot or CTA → event form/modal
5. **Timezone** — shown when users span zones
6. **Conflict warning** — on overlap when relevant

## Event form content

- Title, start/end (or all-day)
- Participants / calendar (if multi-cal)
- Location / link / notes
- Reminders
- Save / Delete (confirm)

## Defaults

- Local timezone default; store UTC
- Drag-resize only if you can also edit via form (a11y)
- Agenda list fallback for dense mobile months

## Anti-patterns

- Events with no visible duration
- Creating events with no undo/delete
- Ignoring DST / timezone in copy

## Checklist

- [ ] Today + navigate + create
- [ ] Event open → edit details
- [ ] Timezone visible when it matters
