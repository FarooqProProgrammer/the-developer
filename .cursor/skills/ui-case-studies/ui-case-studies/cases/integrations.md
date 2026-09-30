# Case study — Integrations / connected apps

Sources: [Eleken settings](https://www.eleken.co/blog-posts/settings-page-ui), [Settings checklist](https://setting.page/settings-page-best-practices-living-checklist).

## Job

Connect, configure, and disconnect third-party tools or API access — with clear status and scope.

## Default blocks

1. **Catalog** — available integrations (logo, name, one-line value)
2. **Connected** — status (connected / error / needs reauth), last sync
3. **Configure** — scopes, mappings, sync frequency
4. **API keys / webhooks** (developer) — create, reveal once, rotate, revoke
5. **Disconnect** — confirm; say what stops syncing

## Content that should appear

| Area | Expected content |
|------|------------------|
| Card | Name, description, Connect / Manage |
| Permissions | What data is shared (readable scopes) |
| Errors | Human reason + Fix CTA |
| Empty catalog | “No integrations yet” only if none exist for plan |

## Defaults

- Least-privilege scopes
- Show “Connected as {account}”
- Webhook signing secret shown once

## Anti-patterns

- Connect with no explanation of data access
- Dead “Connected” with silent sync failures
- API keys shown forever in plaintext

## Checklist

- [ ] Connect + status + disconnect
- [ ] Scope/permission copy before OAuth
- [ ] Error + reauth path
- [ ] Key rotate/revoke for developer tokens
