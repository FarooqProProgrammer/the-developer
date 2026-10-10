# the-developer

> A toolkit for frontend and full-stack engineering, with design skills, portable agent roles, and spec-driven workflows.
> Built for **Google Antigravity**, **Cursor**, **Claude Code**, and compatible agentic development tools.

[![npm version](https://img.shields.io/npm/v/the-developer.svg)](https://www.npmjs.com/package/the-developer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Full-stack workflow

Initialize a project using the local checkout:

```bash
node /path/to/the-developer/bin/cli.mjs init ./my-project --preset=fullstack --target=cursor
cd my-project
node /path/to/the-developer/bin/cli.mjs specify 001-user-auth
node /path/to/the-developer/bin/cli.mjs plan 001-user-auth
node /path/to/the-developer/bin/cli.mjs tasks 001-user-auth
node /path/to/the-developer/bin/cli.mjs verify 001-user-auth
```

After installing the package, use `the-developer` in place of the Node command. Commands also accept `--project=/path/to/project`. `init` defaults to the existing `frontend` preset and Antigravity target; the `fullstack` preset includes all six frontend skills plus nine role definitions and the project constitution.

Generated structure (Cursor target shown):

```text
.cursor/
  agents/                 # Nine portable role definitions
  skills/                 # Existing frontend design skills
.specs/
  constitution.md         # Project standards and coordination rules
  WORKFLOW.md             # Execution guidance
  features/001-user-auth/
    spec.md               # Behavior and acceptance criteria
    plan.md               # Architecture, API contracts and data model
    tasks.md              # Dependencies, owners and file boundaries
    verification.md       # Actual check results and review decision
```

### Agent hierarchy and execution

The orchestrator coordinates product analyst -> architect -> frontend/backend developers -> QA -> integration. Database engineer, security reviewer and DevOps engineer participate when a feature affects their boundaries. Run `the-developer agents list` to list roles.

Each definition includes inputs, ownership, deliverables, completion criteria and handoff rules. Agree on API schemas, errors and permissions before parallel frontend/backend implementation; give each file one owner. The orchestrator verifies the integrated result. Small fixes can use a short sequential plan instead of the complete process.

Role files are portable instructions. Installing them does not register or launch native subagents on every platform. Ask your host assistant to read `.specs/WORKFLOW.md` and the orchestrator definition, then map roles to its delegation tools where supported and permitted. Otherwise it should execute the roles sequentially. No background agent processes or provider credentials are required by this CLI.

### Specification stages

`specify`, `plan`, and `tasks` create editable templates; they do not call an AI provider or generate architecture automatically. Fill the specification before planning, agree on the plan before assigning tasks, then implement and record actual validation evidence. `plan` requires an existing specification; `tasks` requires both specification and plan.

`verify` checks for missing documents, draft markers, unresolved placeholders and failed/unrun outcome rows. It exits nonzero for unfinished scaffolds. It does **not** run application tests, validate the truth of evidence, or grant review approval. Run your project's real checks and review the recorded evidence separately.

Workflow generation and skill installation refuse to overwrite differing existing files. Repeating an unchanged initialization is safe; edited files must be reconciled manually. No force-overwrite mode is provided. This workflow is inspired by spec-driven development and is not a bundled installation of GitHub Spec Kit.

---

## ⚡ Installation & Multi-Agent Ecosystems

`the-developer` works natively across all major AI coding environments. Use the `--target` flag to install the skills where your AI agent reads them:

| AI Assistant / IDE | Target Directory | Install Flag |
| :--- | :--- | :--- |
| **Google Antigravity** *(default)* | `.agents/skills/` | `--target=antigravity` |
| **Cursor IDE** | `.cursor/skills/` | `--target=cursor` |
| **Claude Code** | `.claude/skills/` | `--target=claude` |
| **Windsurf / Codeium** | `.windsurf/skills/` | `--target=windsurf` |
| **GitHub Copilot** | `.github/skills/` | `--target=copilot` |
| **All Platforms (Simultaneous)** | *All above directories* | `--target=all` or `--all` |

---

### Option 1: Direct via `npx` (Recommended · Zero Install)
Run directly from GitHub without installing anything to your project or machine:
```bash
# Default: installs to Google Antigravity (.agents/skills)
npx github:FarooqProProgrammer/the-developer install

# For Cursor IDE (.cursor/skills)
npx github:FarooqProProgrammer/the-developer install --target=cursor

# For Claude Code (.claude/skills)
npx github:FarooqProProgrammer/the-developer install --target=claude

# For Windsurf (.windsurf/skills)
npx github:FarooqProProgrammer/the-developer install --target=windsurf

# Install into ALL supported AI assistants at once:
npx github:FarooqProProgrammer/the-developer install --all

# Or into a specific directory/app with target flag:
npx github:FarooqProProgrammer/the-developer install ./my-web-app --target=cursor
```

### Option 2: Project Dependency via `npm install`
Add it as a dependency in your project:
```bash
# Using GitHub shorthand
npm install github:FarooqProProgrammer/the-developer

# Or using the full repository URL
npm install https://github.com/FarooqProProgrammer/the-developer.git
```
Then run the setup CLI:
```bash
npx the-developer install --target=cursor
# or
npx the-developer install --all
```

### Option 3: Global System Installation
Install globally on your machine so the `the-developer` CLI is always available everywhere:
```bash
npm install -g github:FarooqProProgrammer/the-developer

# Now run anywhere in any terminal:
the-developer install --target=cursor
the-developer install --target=claude
the-developer install --all
the-developer list
the-developer mcp
```

### Option 4: Standard npm Registry (If published)
```bash
npx the-developer install --all
# or
npm install -g the-developer
```

---

## 📦 What's Inside

`the-developer` packages six interconnected skills and autonomous agents designed to eliminate generic "AI-slop" and produce tactile, production-ready frontend software:

| Skill / Agent | Description | Key Disciplines |
| :--- | :--- | :--- |
| **`css-design-tokens`** | **Token-First Architecture (Step 1)** | Root CSS tokenization, perceptual OKLCH color roles, Tailwind v4 `@theme` compliance |
| **`frontend-designer`** | Autonomous Frontend Architect subagent | Coordinates Hallmark, Tailwind, ASW UI/UX, Inspo, and Shadcn |
| **`hallmark`** | Anti-AI-slop design system & auditor | Structural variation, honest copy, pre-emit critique, locked tokens |
| **`micro-animation-interaction`** | Tactile physics & micro-interactions | Damped spring curves, GPU-only transforms, reduced-motion compliance |
| **`scroll-craft`** | Scrollytelling & dimensional landing pages | Scroll as timeline, 8 page grammars, layered hero depth, self-verification |
| **`tailwindcss`** | Modern utility-first CSS architecture | Breakpoints, theme variables, container queries, accessible states |

---

## 🛠️ CLI Usage

```bash
# Install skills into current project
npx the-developer install

# Install skills into a specific directory
npx the-developer install ./path/to/my-project

# List all bundled skills and descriptions
npx the-developer list

# Inspect detailed instructions for a skill
npx the-developer info hallmark
npx the-developer info scroll-craft
npx the-developer info micro-animation-interaction

# View recommended MCP configurations
npx the-developer mcp
```

---

## 🔌 Recommended MCP Server Configuration

To unlock the full potential of the `frontend-designer` agent, add these servers to your `mcp_config.json` (or client settings):

```json
{
  "mcpServers": {
    "inspo": {
      "serverUrl": "https://inspomcp.dev/api/mcp"
    },
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR_API_KEY_HERE"
      }
    },
    "mobbin": {
      "serverUrl": "https://api.mobbin.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MOBBIN_TOKEN"
      }
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

*Note: Inspo MCP requires zero authentication and works out of the box with over 800+ real-world design systems!*

---

## 🚀 Publishing to npm

To publish this package to the npm registry:

1. **Log in to npm** (one-time):
   ```bash
   npm login
   ```

2. **Publish**:
   ```bash
   npm publish
   ```
   *(If publishing under a scoped name like `@farooqproprogrammer/the-developer`, use `npm publish --access public`)*.

---

## 📄 License

MIT © [Farooq](https://github.com/FarooqProProgrammer)
