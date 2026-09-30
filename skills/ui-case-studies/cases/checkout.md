# Case study — Checkout / payment flow

Sources: [Stepper UI practices](https://foundey.com/blog/stepper-ui-best-practices), commerce screen kits (cart → payment → confirm).

## Job

Collect payment / order details with clear progress and no surprise charges.

## Default steps (labeled stepper)

1. **Cart / order summary** — line items, qty, price, remove
2. **Customer / shipping** (if physical or account needed)
3. **Payment** — method, billing address
4. **Review** — totals, taxes, renewals called out
5. **Confirmation** — receipt, next steps, email sent

Show **Step N of M** with **named** stages (not only numbers).

## Content that must appear

| Area | Expected |
|------|----------|
| Running total | Subtotal, tax/VAT, discounts, total — always visible |
| Line items | Name, qty, unit price |
| Trial/renewal | Next charge date + amount in plain language |
| Errors | Card declined → fix path; don’t clear the form |
| Trust | Secure payment mark, refund/trial policy link |

## Defaults

- Guest checkout only if product allows; else sign-in step early
- Don’t charge until explicit confirm on review
- Confirmation page is bookmarkable / email-backed

## Anti-patterns

- Unlabeled “Step 3”
- Hidden recurring charge
- Back button losing cart
- Success page with no order id

## Checklist

- [ ] Named stepper + order summary sticky or repeated
- [ ] Tax/total clarity before pay
- [ ] Confirmation with order/receipt id
