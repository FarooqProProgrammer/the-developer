---
name: feature-pipeline
description: Canonical delivery — input → brainstorm → grill/doc/features → Spec Kit → implement
---

# Feature pipeline

Canonical delivery flow. Run **one stage at a time**; wait for user review between stages. Do not skip to Spec Kit or product code until earlier stages are approved.

```text
input
  → brainstorming
  → grill-me  /  document  /  feature list
  → Spec Kit (specify → plan → tasks)
  → implement (+ converge)
```

## 0. Input

Take the user request (idea, problem, doc, Figma, or ticket). Infer stack from request + repo; ask once if unclear. Ensure Spec Kit exists in the target project (`specify init --here --integration cursor-agent` if missing).

## 1. Brainstorming

Load `brainstorming`. Classify spike / bounded / architectural. Discover intent, write back understanding, get design approval. **Hard gate:** no Spec Kit specify artifacts and no product code until this stage is approved.

## 2. Grill / document / feature list

After brainstorm approval, do **as needed** (often all three for architectural work):

| Step | Command / skill | Output |
|------|-----------------|--------|
| **Grill** | `/grill-me` → `grilling` | Stress-tested design; shared understanding |
| **Document** | Write the agreed brief in chat or a short design note; for user-supplied docs use `extract-meaning-full-insight` / `document-to-flowchart` | Durable what/why the partner can correct |
| **Feature list** | Scoped bullet list of features / non-goals / acceptance criteria (optional `/to-spec` if publishing to the issue tracker) | Handover package for Spec Kit |

Do **not** start Spec Kit until the user confirms the grilled design + feature list (or explicitly skips grill/doc for a tiny bounded change).

## 3. Handover to Spec Kit

Feed the approved brief + feature list into Spec Kit **one stage at a time**:

1. `/speckit-constitution` — only if missing / placeholders
2. `/speckit-specify` — what/why from the handover package
3. Optional `/speckit-clarify`
4. `/speckit-plan`
5. `/speckit-tasks`
6. Optional `/speckit-analyze` / `/speckit-checklist`

## 4. Implement

1. Optional `prototype` (LOGIC/UI throwaway) when the change still needs a quick validation probe
2. `/speckit-implement` — Ponytail ladder + stack skills (`hallmark` for UI, Nest/Node/React as relevant) + SEO rules
3. `/speckit-converge` — repeat with implement until Converged

Do not invent a custom Speckit pipeline. Stack from user request + repo only.

**Skip this whole pipeline** only for pure docs / typo / review / commit / explain, or when the user explicitly says to skip stages.
