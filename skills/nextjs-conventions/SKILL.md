---
name: nextjs-conventions
description: DJ's Next.js code conventions, built on typescript-conventions. Covers the feature-driven layout under src/<feature>, one-way imports, entry components that compose named children, and named components over raw elements. Apply when writing, moving or reviewing code in a Next.js project, especially one whose dstack.json says "recipe": "nextjs".
---

# Next.js conventions

Read `../typescript-conventions/rules.md` first, then `rules.md` in this folder, both in full, before writing code. These rules build on the TypeScript ones.

Projects scaffolded by dstack carry both sets in their `AGENTS.md`, along with lint rules and rule tests that enforce the ones marked **(lint)**. Run `pnpm lint` after each change rather than checking those rules by eye.

When a project's code and these rules disagree, follow the rules for new code. Leave a refactor of the old code to the user's call.
