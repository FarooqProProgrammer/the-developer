# Case study — Auth (sign-in / sign-up)

## Job

Get a real user into a session with clear trust and recovery paths.

## Sign-in — default content

- Product wordmark / name
- Email (or username) + password
- Primary CTA: Sign in
- Secondary: Forgot password, Create account
- Optional: SSO / magic link / passkey — labeled by provider
- Legal: terms / privacy links if required in jurisdiction

## Sign-up — default content

- Email + password (or passwordless)
- Required consents only (marketing opt-in separate, default off)
- Clear password rules before submit
- CTA: Create account
- Link back to Sign in

## Defaults

- Stay signed in: off or “remember this device” with clear wording
- Error messages: specific but not account-enumerating (“Invalid email or password”)
- After success: return to intended deep link or home

## Anti-patterns

- No forgot-password path
- Social buttons with no fallback
- Walls of legal text above the form
- Captcha before any failure signal
