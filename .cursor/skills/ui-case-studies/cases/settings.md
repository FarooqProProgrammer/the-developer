# Case study — Settings

## Job

Let the user change preferences that affect **their** experience (and sometimes org defaults), without leaving the app. Not a kitchen-sink admin panel unless the product is admin-first.

## Default sections (typical SaaS / app)

Ship only what the product needs. Order is a common default:

1. **Profile / account** — name, email, avatar (or link out to Profile)
2. **Preferences** — language, timezone, theme (system / light / dark), density
3. **Notifications** — email / push / in-app toggles; digest frequency
4. **Security** — password change, 2FA, sessions / devices, connected accounts
5. **Billing / plan** — current plan, upgrade/manage (if monetized)
6. **Workspace / team** (if multi-tenant) — name, members link, roles summary
7. **Integrations** — connected apps, API keys (or link to Integrations)
8. **Danger zone** — delete account / leave workspace (separated, confirmed)

## Content that should appear

| Area | Expected content |
|------|------------------|
| Page title | “Settings” (or product synonym) |
| Nav | Sticky section list or left rail for long pages |
| Each section | Short title + one-line description of what it controls |
| Controls | Labels, current value, helper text for non-obvious options |
| Save | Explicit Save / autosave with toast; never silent loss |
| Permissions | Disable or hide controls the user can’t change |
| Mobile | Same sections; collapse to accordion or stacked cards |

## Defaults (sensible starting values)

- Theme: **System**
- Language: browser / account locale
- Timezone: detected, editable
- Notifications: product-critical **on**; marketing **off** until opted in
- 2FA: off until enabled; show status clearly
- Don’t invent billing if there is no plan

## Anti-patterns

- Dumping every admin capability into Settings
- Unlabeled toggles (“Enable feature X” with no consequence text)
- Mixing org-admin and personal settings without tabs/sections
- Delete account next to Theme without a danger zone
- Fake settings that don’t persist

## Checklist before ship

- [ ] Personal vs org settings are visually separated
- [ ] Every control has a clear effect sentence
- [ ] Destructive actions need confirm + type-to-confirm if irreversible
- [ ] Unsaved changes are warned on navigate
- [ ] Deep links / section anchors work for support docs
