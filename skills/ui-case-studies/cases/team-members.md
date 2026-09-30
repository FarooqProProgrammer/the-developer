# Case study — Team / members

Sources: [SaaSUI settings patterns](https://www.saasui.design/blog/saas-settings-page-ux-patterns), [Settings checklist](https://setting.page/settings-page-best-practices-living-checklist).

## Job

Invite people, show who has access, change roles, remove access — safely.

## Default blocks

1. **Member list** — avatar, name, email, role, status (active / invited / disabled)
2. **Invite** — email(s), role picker, send
3. **Pending invites** — resend / revoke
4. **Roles legend** — what Admin / Member / Viewer can do (link to docs if long)
5. **Seat usage** — N of M seats if billed by seat
6. **Danger** — remove member / transfer ownership (confirm)

## Content that should appear

| Area | Expected content |
|------|------------------|
| Table/list | Sortable; search when list is long |
| Role change | Immediate feedback; warn if demoting last admin |
| Invite errors | Clear (already member, invalid email, seats full) |
| Empty | “No teammates yet” + Invite CTA ([empty-state](empty-state.md)) |

## Defaults

- Inviter’s role: Member (not Admin) unless product requires Admin
- Can’t remove last owner/admin without transfer
- SSO-managed members: show “Managed by IdP” and disable local edits

## Anti-patterns

- Role names with no explanation
- Silent invite failures
- Showing billing-only to members who can’t manage billing

## Checklist

- [ ] Invite + list + pending invites exist
- [ ] Last-admin protection
- [ ] Seat limit messaging when applicable
