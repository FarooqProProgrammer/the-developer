# the-developer

> A curated suite of production-grade AI agent skills and design frameworks for modern frontend engineering.  
> Built for **Google Antigravity**, **Cursor**, **Claude Code**, and compatible agentic development tools.

[![npm version](https://img.shields.io/npm/v/the-developer.svg)](https://www.npmjs.com/package/the-developer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Installation & Usage

You can use this toolkit immediately via **GitHub** (no npm publishing required) or via **npm registry**:

### Option 1: Direct via `npx` (Recommended · Zero Install)
Run directly from GitHub without installing anything to your project or machine:
```bash
# Install skills into current project
npx github:FarooqProProgrammer/the-developer install

# Or install into a specific directory/app
npx github:FarooqProProgrammer/the-developer install ./my-web-app
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
npx the-developer install
```

### Option 3: Global System Installation
Install globally on your machine so the `the-developer` CLI is always available everywhere:
```bash
npm install -g github:FarooqProProgrammer/the-developer

# Now run anywhere in any terminal:
the-developer install
the-developer list
the-developer mcp
```

### Option 4: Standard npm Registry (If published)
```bash
npx the-developer install
# or
npm install -g the-developer
```

---

## 📦 What's Inside

`the-developer` packages five interconnected skills and autonomous agents designed to eliminate generic "AI-slop" and produce tactile, production-ready frontend software:

| Skill / Agent | Description | Key Disciplines |
| :--- | :--- | :--- |
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
