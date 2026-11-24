## Conventions

Rules marked **(lint)** fail `pnpm lint`. The rest are judgment calls, and you own them.

### Layout: feature-driven

- `src/app/` holds routes only. A route file renders one feature entry component and exports only what Next.js reads (`default`, `metadata`, route handlers). **(lint)**
- `src/<feature>/` is one feature, named for what the user sees: `landing`, `pricing`, `docs`. Someone looking at the UI should find its code by that name.
- Each feature has one entry component named after it (`Landing.tsx`). Everything else in the folder is a smaller piece it composes. Add a sub-folder only when a piece has pieces of its own.
- `src/primitives/` holds shared building blocks (`Button`, `Stack`, `Text`) and design tokens (`*.stylex.ts`). Promote something to a primitive when a second feature needs it. Until then it stays in its feature.
- `src/lib/` holds non-UI code, grouped by concern (`session/`, `oauth/`).
- Imports flow one way: `app → feature → primitives → lib`. A feature never imports another feature. Share through primitives or lib. **(lint)**

### Files: one thing each

- One module-level export per file: a component, function, class or constant. Types may sit beside it. **(lint)**
- The file name matches the export: `HeroActions.tsx` exports `HeroActions`.
- Use named exports, except in Next.js convention files, which need a default export.
- No barrel files or index re-exports. Import from the source file. **(lint)**
- Split a file when it does two things, not when it gets long.

### Components

- Compose. An entry component should read as a list of named children.
- No more than three raw HTML elements (`div`, `span`, `p`...) per file. Past that, extract a named component. **(lint)**
- Logic a component uses lives in that component. Move it to its own file only when it does a separate job or a second component needs it. No sidecar files like `useHero.ts` or `Hero.utils.ts` serving a single component.
- Style with `stylex.create` in the component's own file, reading tokens from `src/primitives/*.stylex.ts`. Build interactive primitives on Base UI.
- Components are Server Components by default. Add `'use client'` only to the leaf that needs state, effects or browser APIs.

### Comments

- Module-level comments are JSDoc (`/** ... */`). **(lint)**
- Comment only what the code can't say: a workaround, a constraint you can't see from the code, why one approach was chosen over another. Never restate the code.

### Tests

- Tests do two jobs only: enforce these rules, and cover regressions.
- Rule tests live at `tests/rules/<rule-name>.test.ts` and lint sample code through the real config.
- Regression tests live at `tests/<feature>/<what-broke>.test.ts`, under the feature they cover.
- A new rule that can be checked by a tool gets a lint rule and a rule test, not just a line here.
