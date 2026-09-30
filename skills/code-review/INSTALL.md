---
title: Install review CLIs
---

# Install review CLIs

Ask the user before installing. Prefer project-local configs; do not invent stacks.

## CodeRabbit CLI

Docs: https://docs.coderabbit.ai/cli · Windows: https://docs.coderabbit.ai/cli/windows

### Windows (PowerShell)

```powershell
irm https://cli.coderabbit.ai/install.ps1 | iex
```

Open a **new** shell, then:

```powershell
coderabbit --version
cr --version
coderabbit auth login
# EU accounts:
coderabbit auth login --region eu
coderabbit doctor
```

### macOS / Linux

```bash
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
# or: brew install coderabbit
coderabbit auth login
coderabbit doctor
```

### Agent review

```bash
coderabbit review --agent
coderabbit review --agent --base main
```

Optional: `coderabbit skills` installs CodeRabbit’s verified agent skills — only with user consent.

Do **not** commit API keys. Prefer browser login or a secret store / env var the user already uses (`CODERABBIT_API_KEY` if they set it).

## React Doctor

Docs: https://www.react.doctor/ · CI: https://www.react.doctor/docs/ci-and-prs/github-actions-setup

### One-off scan (no install)

```bash
npx react-doctor@latest . -y --verbose --json
npx react-doctor@latest . -y --scope changed --base main --json
```

### Agent skill / local hooks

```bash
npx react-doctor@latest install
```

### GitHub Actions PR gate

```bash
npx react-doctor@latest ci install -y
# later:
npx react-doctor@latest ci config --blocking error
npx react-doctor@latest ci upgrade
```

Telemetry opt-out: `npx react-doctor@latest --no-telemetry`.

## ESLint

Use the project’s existing ESLint config and package scripts. Only scaffold ESLint if the user explicitly asks to add it — do not invent a config in a review.

```bash
npm run lint
# or
npx eslint . --max-warnings 0
```
