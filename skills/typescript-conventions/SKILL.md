---
name: typescript-conventions
description: DJ's TypeScript code conventions. Covers one export per file, no barrels, logic files that read from the top (export first, named steps, at most three private helpers, one config object, no module-level state), JSDoc-only module comments, and tests that enforce rules or cover regressions. Apply when writing, moving or reviewing TypeScript code.
---

# TypeScript conventions

Read `rules.md` in this folder in full before writing code.

Projects scaffolded by dstack carry the same rules in their `AGENTS.md`, along with lint rules and rule tests that enforce the ones marked **(lint)**. Run `pnpm lint` after each change rather than checking those rules by eye. To assess existing code against these rules, the user can run `/dstack:assess-logic-dx`.

When a project's code and these rules disagree, follow the rules for new code. Leave a refactor of the old code to the user's call.
