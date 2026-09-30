# Case study — Notification preferences

Sources: [Eleken settings guide](https://www.eleken.co/blog-posts/settings-page-ui), [Settings checklist](https://setting.page/settings-page-best-practices-living-checklist), [SaaSUI settings patterns](https://www.saasui.design/blog/saas-settings-page-ux-patterns).

## Job

Let users control **volume and relevance** of alerts — by channel and by event — without hunting through product modules.

## Default structure

Organize by **user mental model**, not backend services:

1. **Channels** — Email, Push, In-app, SMS (only channels you actually send)
2. **Event groups** — Account/security, Product activity, Mentions/comments, Billing, Marketing
3. **Frequency** — Instant / daily digest / weekly (where volume is high)
4. **Quiet hours** (optional) — mute push overnight

## Content that should appear

| Area | Expected content |
|------|------------------|
| Section intro | One line: what these controls affect |
| Per event | Label + short “when you’ll hear from us” |
| Matrix | Event × channel toggles, or channel pages with event lists |
| Security alerts | Often non-disableable; say so (“Required for account safety”) |
| Marketing | Default **off**; separate from product mail |

## Defaults

- Security / billing receipt: **on**
- Marketing / tips: **off**
- High-volume activity: digest default over instant
- Don’t invent SMS if unused

## Anti-patterns

- One global “Email me everything”
- Toggles with no event description
- Marketing bundled with transactional mail
- Mute that also kills password-reset mail

## Checklist

- [ ] Channel list matches real delivery channels
- [ ] Required alerts labeled and locked
- [ ] Save/autosave feedback visible
- [ ] Unsubscribe footer in emails matches these prefs
