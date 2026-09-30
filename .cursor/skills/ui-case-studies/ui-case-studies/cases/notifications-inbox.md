# Case study — Notifications inbox / activity feed

Sources: [Northbase empty states](https://www.northbase.design/patterns/empty-states) (inbox-zero celebration pattern).

## Job

Show things that need attention; let users triage (read, act, dismiss).

## Default blocks

1. **List** — actor, action summary, time, unread marker
2. **Filters** — All / Unread / Mentions (as needed)
3. **Bulk** — Mark all read
4. **Row actions** — open target, mark read, archive/dismiss
5. **Empty** — see below
6. Link to **Notification preferences** ([notifications](notifications.md))

## Content per item

- Who + what + where (link to the object)
- Relative time
- Unread vs read styling
- Optional category icon (billing, comment, system)

## Empty states (two different jobs)

| State | Tone | Example |
|-------|------|---------|
| Never had any | Neutral + forward | “No notifications yet” |
| Inbox zero (caught up) | **Celebratory OK** | “You’re all caught up” |

Don’t use celebration for first-run emptiness.

## Defaults

- Newest first
- Mark read on open (or explicit)
- Prefer deep link to the object over dead-end detail pages

## Anti-patterns

- Preferences buried with no link from the inbox
- Unread badge that doesn’t clear
- Celebrating “No notifications yet” on day one

## Checklist

- [ ] Unread affordance + mark all read
- [ ] Item opens the right record
- [ ] Distinct copy for first-run vs caught-up
- [ ] Link to notification settings
