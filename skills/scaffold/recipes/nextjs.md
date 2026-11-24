# Next.js recipe

For marketing sites, landing pages, and dev sites with docs.

## Stack

Fixed. Don't ask about these.

- Next.js App Router, built with Turbopack and SWC
- StyleX compiled by `@stylexswc` (Rust/SWC, no Babel)
- Base UI for interactive primitives
- TypeScript, ESLint with the dstack rules, Vitest, pnpm

## Layers

| Layer | Add when the request mentions | Notes |
|---|---|---|
| `auth` | sign-in, accounts, a dashboard, gated content, OAuth | `layers/nextjs-auth.md` |
| `docs` | docs, guides, a dev site, MDX | `layers/nextjs-docs.md` |

A marketing or landing site with neither signal gets the base only.

## Steps

1. Copy the templates:
   `node <this skill's folder>/bin/scaffold.mjs --recipe nextjs --name <name> --target <folder> [--layers auth,docs]`
2. `cd <folder> && pnpm install`
3. Fit the landing feature to the request: the copy in `src/landing/HeroCopy.tsx` and `metadata` in `src/app/layout.tsx`.
4. For each feature the request names, add `src/<feature>/` with one entry component and a route in `src/app/` that renders it. Don't add features the request didn't name.
5. Do each layer's steps.
6. `pnpm verify` must pass. It runs typecheck, lint, tests and build.
7. `git init && git add -A && git commit -m "Scaffold <name> with dstack nextjs"`

## What the template gives you

```
src/app/          routes only; each renders one feature entry component
src/landing/      the landing feature: Landing → Hero → HeroCopy, HeroActions
src/primitives/   Button (Base UI), ButtonLink, Stack, Heading, Text, tokens (*.stylex.ts)
eslint/           local rules: one-export-per-file, export-first, max-module-helpers,
                  max-raw-elements, module-comments-jsdoc. eslint.config.mjs also turns on
                  no module-level let, max-params 3, max-lines-per-function 50, complexity 10
tests/rules/      one test per enforced rule, linting samples through the real config
AGENTS.md         typescript-conventions + nextjs-conventions (per conventions.json); Cursor reads it
CLAUDE.md         one line, @AGENTS.md, so Claude Code reads the same file
dstack.json       recipe and layers used, for later dstack skills
```

## Constraints behind the template

These were found by building it. Keep them unless you've re-tested:

- `typescript` is pinned to `~6.0`. typescript-eslint supports only versions below 6.1.
- `pnpm-workspace.yaml` allows the `@swc/core` build script. pnpm 11 fails the install without it.
- `postcss.config.mjs` uses `process.cwd()`. Turbopack's PostCSS loader has no `import.meta.dirname`.
- Under Turbopack, StyleX CSS is extracted by `@stylexswc/postcss-plugin` into `src/app/stylex.css`, which holds the `@stylex;` directive. Remove it and styles disappear.

To upgrade: run `pnpm up --latest` in a scaffolded project. Once `pnpm verify` passes, copy the new ranges into `templates/nextjs/base/package.json`.
