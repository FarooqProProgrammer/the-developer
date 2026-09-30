---
name: document-to-flowchart
description: Convert a user document into a Mermaid flowchart
---

Load and follow the `document-to-flowchart` skill.

**Take the document from the user** (attachment, paste, or workspace path). If none is provided, ask for it once. Extract start/end, steps, and decisions from the source, then output a Mermaid `flowchart` plus a short legend and gaps. Do not invent steps that are not in the document.
