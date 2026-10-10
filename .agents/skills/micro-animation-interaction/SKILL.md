---
name: micro-animation-interaction
description: Architect and implement tactile, performant micro-animations, physics-based motion, and state transitions for frontend web interfaces. Use when adding interactive feedback, hover/press physics, page/layout transitions, skeleton states, gesture response, or spring animations using Tailwind CSS, CSS variables, Framer Motion, Motion, or the Web Animations API.
---

# Micro-Animation & Interaction Design Skill

This skill guides the design and implementation of snappy, tactile, and performant micro-interactions. It turns flat, static web interfaces into alive, responsive surfaces while strictly avoiding floaty, sluggish, or distracting animations.

---

## 1. Core Principles of Tactile Motion

1. **Subservient to Utility**: Motion must clarify state, provide haptic feedback, or establish spatial relationships. Never delay the user's workflow; interactive elements must accept input immediately without waiting for transitions.
2. **Snappy & Grounded (Spring Physics over Floaty Easing)**:
   - Micro-interactions (clicks, toggles, hover): **100ms – 180ms**.
   - UI Transitions (dropdowns, tooltips, toasts): **150ms – 240ms**.
   - Structural Layouts (dialogs, sheet drawers, page transitions): **220ms – 320ms**.
   - Never use default `linear` or floaty `ease-in-out` for physical objects. Use damped spring curves (`stiffness: 400–500, damping: 28–35`).
3. **Compositor-Only Performance**:
   - **Only animate `transform` and `opacity`**.
   - Never animate `width`, `height`, `margin`, `padding`, or `top/left` directly, which trigger CPU layout reflows. Use CSS scale transforms or modern FLIP / View Transitions.
4. **Mandatory Reduced Motion**:
   - Honor `prefers-reduced-motion: reduce`. Replace position/scale jumps with instantaneous changes or gentle opacity dissolves.

---

## 2. Standard Motion Archetypes & Timing

| Pattern | Ideal Duration | Physics / Curve | Key Properties |
| :--- | :--- | :--- | :--- |
| **Button Tap / Click** | 100ms – 140ms | Snappy Spring (`scale(0.97)`) | `transform: scale(0.97)` active state |
| **Card / Hover Lift** | 160ms – 220ms | Smooth Decel (`cubic-bezier(0.16, 1, 0.3, 1)`) | `transform: translateY(-2px)`, shadow token |
| **Input Focus Glow** | 150ms – 200ms | Gentle Ease-out | `box-shadow`, `border-color` |
| **Dropdown / Popover Reveal** | 160ms – 220ms | Spring Enter (`scale: 0.95 -> 1`, `y: -4px -> 0`) | `opacity`, `transform` |
| **Error Shake** | 300ms – 400ms | Damped 3-cycle sine wave | `translateX(-4px)` -> `+4px` -> `0` |
| **List Stagger Entrance** | 30ms – 50ms stagger | Cascading fade-up | `opacity: 0 -> 1`, `translateY(8px -> 0)` |
| **Tab / Active Pill Slide** | 200ms – 260ms | Bouncy Spring or CSS layoutId | `transform: translateX()`, layout indicator |

---

## 3. Implementation Recipes

### A. Pure Tailwind CSS & CSS Variables (Zero Dependencies)

Add these high-utility spring tokens into your Tailwind configuration or root CSS:

```css
:root {
  /* Snappy tactile press curve */
  --ease-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);
  /* Physical decelerate curve for entrances */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  /* Gentle spring back */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

#### 1. Tactile Interactive Button
```html
<button class="relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-150 ease-[var(--ease-snappy)] bg-primary-600 rounded-lg hover:bg-primary-500 hover:shadow-md active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
  <span>Confirm Action</span>
</button>
```

#### 2. Damped Error Shake
```css
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-error-shake {
  animation: error-shake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
```

#### 3. Shimmer Skeleton Loading
```html
<div class="relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"></div>
```

---

### B. Framer Motion / Motion (`motion/react`)

When building React interfaces, use unified spring configurations:

```tsx
import { motion, AnimatePresence } from "motion/react";

// Standard Spring Presets
export const springs = {
  snappy: { type: "spring", stiffness: 450, damping: 30 },
  bouncy: { type: "spring", stiffness: 350, damping: 20 },
  gentle: { type: "spring", stiffness: 260, damping: 26 },
};

// 1. Sliding Pill Tab Indicator
export function SegmentedControl({ options, selected, onChange }) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className="relative px-3 py-1.5 text-sm font-medium transition-colors"
        >
          {selected === opt.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-white dark:bg-slate-700 shadow-sm rounded-lg"
              transition={springs.snappy}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// 2. Tactile Modal Dialog
export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={springs.snappy}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## 4. Accessibility & Reduced Motion Protocol

Every interactive component with animation must account for reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In Motion / React:
```tsx
import { useReducedMotion } from "motion/react";

const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : springs.snappy;
```

---

## 5. Quality Checklist for Micro-Interactions

Before shipping any micro-interaction, verify:
- [ ] **No blocking latency**: Does the UI respond immediately to click/tap events?
- [ ] **60/120 FPS**: Are all animations strictly GPU-composited (`transform`, `opacity`)?
- [ ] **No layout shift**: Does the animation avoid causing surrounding elements to jitter or reflow?
- [ ] **Restraint**: Does the motion feel natural and quiet rather than flashy or attention-seeking?
- [ ] **Accessible**: Does it respect `prefers-reduced-motion: reduce`?
