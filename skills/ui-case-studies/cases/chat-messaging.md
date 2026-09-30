# Case study — Chat / messaging

Sources: collaboration patterns in SaaS kits (conversation list + thread).

## Job

Async or near-real-time conversation between people (or support) with clear unread state.

## Default layout

1. **Conversation list** — title/participants, last message preview, time, unread badge
2. **Thread** — messages newest or oldest direction consistent; day separators
3. **Composer** — text, attach, send; disabled with reason if read-only
4. **Header** — who you’re talking to, status, overflow (mute, leave, info)

## Content per message

- Author + timestamp
- Body (text/markdown/attachments)
- Delivery/read state if product needs it (sent / failed)
- Retry on failed send

## Empty states

- No conversations → start CTA
- Empty thread → “Send the first message”
- Don’t celebrate empty support inboxes for agents the same way as user inbox-zero

## Defaults

- Optimistic send with failure rollback
- Deep link to a thread
- Notification prefs link ([notifications](notifications.md))

## Anti-patterns

- No failed-send recovery
- Infinite scroll with no jump-to-latest
- Composer that loses draft on navigate (warn or persist)

## Checklist

- [ ] List + thread + composer
- [ ] Unread affordance
- [ ] Attach + error retry if attachments exist
