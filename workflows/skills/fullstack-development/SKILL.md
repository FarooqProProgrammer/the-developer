---
name: fullstack-development
description: Implement complete features across UI, APIs and persistence.
---

# Fullstack Development

Read the feature specification and technical plan. Map acceptance criteria to boundaries. Agree on request/response types, errors and authorization before parallel work. Implement vertical slices and verify integrated behavior, including loading and failure states. Keep one file owner and one integration owner. Use existing repository scripts and architecture; avoid inventing a new stack.

## Completion evidence
Report changed files, commands actually executed, outcomes, remaining limitations and next owner. Follow project instructions and `.specs/constitution.md`.

## Convergence over large one-shot changes
Use the Helix-inspired loop in `.developer/CHECKPOINTS.md`. Define small ordered slices with direct references. A test-designer prepares integration cases; behavior runs before scoped visuals, then two isolated adversarial reviews and actual engineer approval. Fix failed gates and rerun after source changes. Autonomous operation never weakens technical gates. Archive evidence and accepted feedback for the next slice.
