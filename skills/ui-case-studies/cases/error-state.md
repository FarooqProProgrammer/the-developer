# Case study — Error / failed load

Sources: [Prism system states](https://prism-design.supernova-docs.io/latest/patterns/system-behavior/empty-states-9pR3nPit), [Stripe empty vs error](https://docs.stripe.com/stripe-apps/patterns/empty-state).

## Job

Something went wrong fetching or saving — separate from empty data.

## Default content

1. Clear title — “Couldn’t load {thing}” / “Something went wrong”
2. Short reason if safe (timeout, permission) — else generic
3. **Primary CTA** — Try again / Refresh
4. **Secondary** — Go back / Home / Contact support
5. Optional reference id for support (request id)

## Render order

`loading` → `error` → `empty` → `content` — never show empty when the request failed.

## Defaults

- Retry is the default primary action
- Preserve user input on save errors; show field-level messages when possible
- Full-page error for route failures; inline error for one panel

## Anti-patterns

- Empty-state illustration for a 500
- Only a console-style stack trace for end users
- Auto-retry loops with no escape

## Checklist

- [ ] Error ≠ empty visually
- [ ] Retry + escape route
- [ ] Support id when available
