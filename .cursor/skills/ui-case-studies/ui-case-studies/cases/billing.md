# Case study — Billing & plan (in-app)

Sources: [SaaSUI settings patterns](https://www.saasui.design/blog/saas-settings-page-ux-patterns), [Eleken settings](https://www.eleken.co/blog-posts/settings-page-ui).

## Job

Answer: What am I on, what will I be charged, how do I change or leave — in plain language.

## Default blocks

1. **Current plan** — name, price, billing period, renewal/next charge date
2. **Usage / seats** — against plan limits (if metered)
3. **Payment method** — brand + last4, update CTA
4. **Invoices** — list with date, amount, PDF/download
5. **Upgrade / change plan** — clear path (modal or pricing)
6. **Cancel / downgrade** — visible, not hidden (trust > dark pattern)

## Content that should appear

| Area | Expected content |
|------|------------------|
| Plan card | Plan name, price, interval, status (trial / active / past_due) |
| Next charge | Amount + date in local currency/timezone when possible |
| Failed payment | Banner with fix CTA |
| Tax / company | Billing email, company name, VAT if needed |

## Defaults

- Show trial end date prominently during trial
- Past invoices newest-first
- Don’t show fake “unlimited” metrics

## Anti-patterns

- Hiding cancel behind chat-only flows
- Price without interval (“$29” vs “$29/mo”)
- Seat count with no who-is-using link

## Checklist

- [ ] Plan + next charge readable without support
- [ ] Update payment works without leaving app (or clear Stripe Customer Portal link)
- [ ] Cancel path exists and confirms consequences (data retention)
