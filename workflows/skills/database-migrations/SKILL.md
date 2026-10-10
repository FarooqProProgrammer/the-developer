---
name: database-migrations
description: Design and evolve persistent data safely.
---

# Database Migrations

Inspect the existing database and migration tool. Define constraints and query access patterns before adding indexes. Prefer compatible expand/migrate/contract changes. Explain data backfills, locking, deployment order and rollback limits. Test migrations against a disposable database with representative data. Destructive operations require explicit authorization; never assume a production connection is safe.

## Completion evidence
Report changed files, commands actually executed, outcomes, remaining limitations and next owner. Follow project instructions and `.specs/constitution.md`.
