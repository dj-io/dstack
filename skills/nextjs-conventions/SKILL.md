---
name: nextjs-conventions
description: DJ's Next.js code conventions. Covers the feature-driven layout under src/<feature>, one export per file, no barrels, one-way imports, named components over raw elements, and JSDoc-only module comments. Apply when writing, moving or reviewing code in a Next.js project, especially one whose dstack.json says "recipe": "nextjs".
---

# Next.js conventions

Read `rules.md` in this folder in full before writing code.

Projects scaffolded by dstack carry the same rules in their `AGENTS.md`, along with lint rules and rule tests that enforce the ones marked **(lint)**. Run `pnpm lint` after each change rather than checking those rules by eye.

When a project's code and these rules disagree, follow the rules for new code. Leave a refactor of the old code to the user's call.
