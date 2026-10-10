# the-developer

> A curated suite of production-grade AI agent skills and design frameworks for modern frontend engineering.  
> Built for **Google Antigravity**, **Cursor**, **Claude Code**, and compatible agentic development tools.

[![npm version](https://img.shields.io/npm/v/the-developer.svg)](https://www.npmjs.com/package/the-developer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
