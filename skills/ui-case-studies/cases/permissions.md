# Case study — Roles & permissions

Sources: admin permission-matrix patterns; [Settings checklist](https://setting.page/settings-page-best-practices-living-checklist) (permission-type controls).

## Job

Define what each role can do — scannable, least-privilege, hard to misconfigure.

## Default blocks

1. **Roles list** — name, description, member count
2. **Permission matrix** — roles × capabilities (view/edit/admin)
3. **Role detail** — editable name (custom roles), clone role
4. **Danger** — delete role (block if members assigned)

## Content defaults

| Area | Expected |
|------|----------|
| Capability rows | Grouped (Billing, Members, Content…) with plain labels |
| System roles | “Owner/Admin” marked non-deletable |
| Changes | Confirm when widening access; summary of impact |

## Defaults

- Deny by default for new custom capabilities
- Last-owner protections ([team-members](team-members.md))
- Audit permission changes ([audit-log](audit-log.md))

## Anti-patterns

- Checkbox jungle with no groups
- Renaming “Admin” without explaining powers
- Allowing zero-admins state

## Checklist

- [ ] Matrix or equivalent grouped list
- [ ] System vs custom roles clear
- [ ] Delete/ demote guards
