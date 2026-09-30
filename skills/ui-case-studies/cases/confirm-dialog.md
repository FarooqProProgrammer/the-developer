# Case study — Confirm dialog / destructive modal

Sources: destructive-action patterns in settings/data-table guidance.

## Job

Confirm an irreversible or costly action — proportional friction, clear consequence.

## Default content

1. **Title** — verb + object (“Delete project ‘Alpha’?”)
2. **Body** — what happens, what is kept/lost
3. **Optional type-to-confirm** — type name for high severity
4. **Actions** — Cancel (safe, focused) + Destructive confirm (labeled with verb)
5. Don’t rely on color alone — also word the button (“Delete”)

## Severity ladder

| Level | Pattern |
|-------|---------|
| Low | Toast undo |
| Medium | Modal confirm |
| High | Type name / password reentry |

## Defaults

- Focus trap in modal; Esc = cancel
- Confirm button disabled until type-to-confirm matches
- After success: toast + navigate away if object gone

## Anti-patterns

- “Are you sure?” with no object name
- Confirm as primary blue “OK”
- Nested modals
- Instant delete on row click with no undo on medium severity

## Checklist

- [ ] Object named in title/body
- [ ] Consequence stated
- [ ] Cancel easy; confirm explicit
