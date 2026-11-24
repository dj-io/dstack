## TypeScript conventions

### Files: one thing each

- One module-level export per file: a component, function, class or constant. Types may sit beside it. **(lint)**
- The file name matches the export: `chooseDrops` lives in `chooseDrops.ts` or `choose-drops.ts`. Pick one casing per project and keep to it.
- Use named exports, except where a framework needs a default export.
- No barrel files or index re-exports. Import from the source file. **(lint)**
- Split a file when it does two things, not when it gets long.

### Logic files: readable from the top

A developer should be able to tell what a file does, and its main steps, from the export and the names alone, without reading the helpers.

- Lead with the export. Order a file as imports, constants, the exported entry, then its helpers in the order the entry calls them. No helper function or class above the export. **(lint)**
- Write helpers as `function` declarations, so they can sit below the code that calls them.
- The entry reads as named steps. Its body is a short list of calls whose names describe the work, the same way a component reads as a list of named children.
- No more than three private helpers per file. Past that, the file is a folder: split it by step, one module per step. **(lint)**
- Tuning values live in one typed config object with a JSDoc line per field, giving units and the reason for the value. No loose constants like `SLOP = 0.0004` scattered across files.
- Helpers take what they need as parameters instead of reading module-level values.
- No module-level mutable state (`let` at the top level). **(lint)**
- More than three parameters means an options object. **(lint)**
- Keep functions small and shallow: at most 50 lines and a complexity of 10. **(lint)**
- Name data, not just functions. A tuple like `[x, y, z]` or a bare `number` id that crosses a file boundary gets a named type.

### Comments

- Module-level comments are JSDoc (`/** ... */`). **(lint)**
- Comment only what the code can't say: a workaround, a constraint you can't see from the code, why one approach was chosen over another. Never restate the code.

### Tests

- Tests do two jobs only: enforce these rules, and cover regressions.
- Rule tests live at `tests/rules/<rule-name>.test.ts` and lint sample code through the real config.
- Regression tests live at `tests/<feature>/<what-broke>.test.ts`, under the feature or module they cover.
- A new rule that can be checked by a tool gets a lint rule and a rule test, not just a line here.
