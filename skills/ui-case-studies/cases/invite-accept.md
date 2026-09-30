# Case study — Invite accept / join workspace

Sources: team invite flows paired with [team-members](team-members.md).

## Job

Turn an invite link/email into a membership — with clear workspace and role.

## Default screens

1. **Landing from link** — workspace name, inviter, role you’ll get
2. **Auth gate** — sign in / sign up if needed ([auth](auth.md))
3. **Accept confirm** — Join / Decline
4. **Success** — land on home/onboarding for that workspace
5. **Failure** — expired, revoked, wrong email, seats full

## Content that should appear

| State | Content |
|-------|---------|
| Valid invite | Workspace avatar/name, role, who invited |
| Email mismatch | “Invite sent to X — signed in as Y” + switch account |
| Expired | Ask admin to resend |
| Seats full | Message + contact admin / upgrade |

## Defaults

- Bound invite to email when issued that way
- Single-use or expiry date shown
- Decline is safe and quiet

## Anti-patterns

- Auto-join with no confirmation
- Opaque “invalid invite” for all failure modes
- Dropping user into wrong workspace with no name shown

## Checklist

- [ ] Show workspace + role before join
- [ ] Distinct errors (expired / mismatch / seats)
- [ ] Success → correct workspace home
