---
name: css-design-tokens
description: Token-first frontend design procedure. Enforces defining and locking design tokens (OKLCH color roles, spacing scales, fluid typography, radius, shadows, easings) in root CSS using modern CSS Custom Properties and Tailwind CSS v4 `@theme` directive before generating or writing any UI components.
---

# Token-First Design & CSS Tokenization Skill

This skill enforces the fundamental rule of professional frontend architecture: **design tokens come first**. Before generating markup, writing React components, or tweaking UI cards, you must establish and lock the project's design tokens in the central stylesheet.

---

## 1. The Token-First Workflow

```mermaid
flowchart LR
    A["Step 1: Audit & Archetype"] --> B["Step 2: Define Design Tokens in CSS"]
    B --> C["Step 3: Register @theme / Tokens"]
    C --> D["Step 4: Build Components with Token Utilities"]
    D --> E["Step 5: Enforce No Hardcoded Values"]
```

### The Strict Non-Negotiables:
1. **Never jump straight into markup/JSX**: No component coding until the token block is established in the root CSS (`globals.css`, `app.css`, or `index.css`).
2. **Never hardcode inline hex/rgb colors**: No `bg-[#1a1a1a]` or inline `rgb(240, 240, 240)`. Every color must resolve to a semantic token.
3. **Use OKLCH for predictable perception**: Colors must be specified in the `oklch(L C H)` color space for uniform perceptual lightness across light and dark modes.
4. **Follow modern Tailwind CSS token rules**:
   - In **Tailwind CSS v4+**: Use the native `@theme` directive in CSS (`@theme { --color-*: ...; --font-*: ...; }`).
   - In **Tailwind CSS v3**: Bind `theme.extend` in `tailwind.config.js` to CSS custom properties (`var(--...)`).

---

## 2. Design Token Architecture & Naming Conventions

Every production web project requires five distinct token categories:

### A. Semantic Color Tokens (OKLCH)
Separate **palette scales** (raw hues) from **semantic roles** (what they mean):

| Semantic Role | Token Name | Purpose | Example Value |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `--color-background` | Root surface background | `oklch(0.99 0 0)` / `oklch(0.14 0.01 260)` |
| **Foreground / Text** | `--color-foreground` | High-contrast body text | `oklch(0.20 0.02 260)` / `oklch(0.98 0 0)` |
| **Muted Text** | `--color-muted-foreground` | Secondary/caption text | `oklch(0.55 0.02 260)` |
| **Surface / Card** | `--color-surface` | Elevated panels & cards | `oklch(1.0 0 0)` / `oklch(0.18 0.01 260)` |
| **Border / Divider** | `--color-border` | Subtle structural hairlines | `oklch(0.92 0.01 260)` / `oklch(0.28 0.01 260)` |
| **Primary / Brand** | `--color-primary` | Main interactive emphasis | `oklch(0.58 0.22 260)` |
| **Accent** | `--color-accent` | Highlights & badge tags | `oklch(0.75 0.16 65)` |
| **Destructive / Error** | `--color-destructive` | Errors & irreversible actions | `oklch(0.62 0.24 25)` |

### B. Spacing & Rhythm Tokens
Base all padding and margins on a 4px geometric scale:
```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
--spacing-3xl: 4.5rem;  /* 72px */
```

### C. Fluid Typography Scale
Use `clamp()` for smooth responsive scaling without messy breakpoint overrides:
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-display: 'Plus Jakarta Sans', var(--font-sans);
--font-mono: 'JetBrains Mono', monospace;

--text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem);
--text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem);
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);
--text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
--text-3xl: clamp(2rem, 1.75rem + 1.25vw, 2.75rem);
--text-display: clamp(2.5rem, 2.1rem + 2vw, 4rem);
```

### D. Radius & Elevation Tokens
```css
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px;

--shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-elevated: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06);
--shadow-popover: 0 12px 24px -4px rgb(0 0 0 / 0.12), 0 4px 8px -2px rgb(0 0 0 / 0.08);
```

---

## 3. Production CSS Implementation Templates

### A. Modern Tailwind CSS v4 Template (`@theme` Directive)

In Tailwind CSS v4, configure everything in pure CSS using `@theme`:

```css
/* app.css or globals.css */
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Cabinet Grotesk", var(--font-sans);

  /* Spacing Scale */
  --spacing-container: 75rem;

  /* Custom Breakpoints */
  --breakpoint-3xl: 120rem;

  /* Semantic Theme Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);

  /* Micro-Motion Easings */
  --ease-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Light Mode Variables */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.18 0.02 260);
  --surface: oklch(1.0 0 0);
  --border: oklch(0.92 0.01 260);
  --primary: oklch(0.55 0.22 260);
  --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.95 0.01 260);
  --muted-foreground: oklch(0.55 0.02 260);
  --accent: oklch(0.85 0.14 75);
  --destructive: oklch(0.62 0.24 25);
}

/* Dark Mode Variables */
.dark, [data-theme="dark"] {
  --background: oklch(0.14 0.01 260);
  --foreground: oklch(0.98 0 0);
  --surface: oklch(0.18 0.01 260);
  --border: oklch(0.28 0.01 260);
  --primary: oklch(0.65 0.22 260);
  --primary-foreground: oklch(0.14 0.01 260);
  --muted: oklch(0.22 0.01 260);
  --muted-foreground: oklch(0.65 0.02 260);
  --accent: oklch(0.75 0.16 75);
  --destructive: oklch(0.68 0.24 25);
}
```

---

### B. Tailwind CSS v3 Legacy / Config-Based Template

If working with Tailwind v3, bind CSS custom properties through `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      }
    }
  }
}
```

---

## 4. Verification & Lint Gate

Before delivering any frontend component:
- [ ] Are all colors bound to `--color-*` / semantic utility classes (`bg-background`, `text-primary`, `border-border`)?
- [ ] Is there **zero** arbitrary hex values (`bg-[#...]`) in the markup?
- [ ] Are font sizes and section padding referencing fluid tokens or standardized scales?
- [ ] Does dark mode automatically transition cleanly by toggling `.dark` without extra code?
