# Case study — Profile / account

## Job

Show and edit **who the user is** in the product: identity, contact, visibility.

## Default blocks

1. **Identity** — avatar, display name, username/handle (if any)
2. **Contact** — email (verified badge), phone (optional)
3. **About** — bio / title / company (only if social or B2B directory)
4. **Visibility** — public profile vs private (if applicable)
5. **Linked accounts** — Google / GitHub / etc. (link to Security if preferred)

## Content that should appear

| Area | Expected content |
|------|------------------|
| Header | Avatar + name + email summary |
| Form | Field labels, validation messages, character limits |
| Verification | “Verify email” CTA if unverified |
| Read-only fields | SSO-provisioned fields marked “Managed by org” |

## Defaults

- Avatar: initials fallback from name/email
- Display name: from signup; not empty string
- Don’t require bio/phone unless product-critical

## Anti-patterns

- Editing password only here with no Security section elsewhere (or duplicate without sync)
- Public profile fields with no preview of how others see them
