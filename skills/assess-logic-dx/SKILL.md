---
name: assess-logic-dx
description: Staff-level assessment of how readable a TypeScript logic file or folder is for developers. Checks whether its work can be understood from its exports and names, where boundaries blur, and which design patterns would fix it. Use for /assess-logic-dx or requests to assess, review or critique the API design or DX of logic files.
disable-model-invocation: true
argument-hint: "<file or folder>"
---

# Assess logic DX

Judge one question: can a developer who opens this file tell what it does, and its main steps, without reading the helpers? Report what blocks that and the design that would fix it. Don't edit code unless the user asks after reading the report.

## 1. Load the standard

Read `../typescript-conventions/rules.md` (relative to this skill's folder) in full. If the target is in a Next.js project, also read `../nextjs-conventions/rules.md`. Every finding cites the rule it breaks, or says plainly that no rule covers it yet.

## 2. Map the target

- For a folder, start from its entry: the file other code imports, or the script that runs. Follow imports inward, but stay inside the target.
- For each file, record its export, its private top-level helpers, its module-level constants and state, and what it imports.
- If the project has the dstack lint rules (`eslint/rules/export-first.mjs` exists), run `pnpm lint` on the target and take its output as given. Spend your judgment on what lint can't see.

## 3. Work out the job from the outside

For each entry file, write down from the export signature, the names and the JSDoc only:

1. its job, in one sentence
2. its main steps, in order

Then read the body and compare. Every gap between what the surface says and what the code does is a finding. A file whose job you can't state from the surface is the most serious finding there is.

## 4. Find what blurs it

Look for:

- helpers or classes above the export, so the reader meets how before what
- an entry body that is a wall of statements instead of named steps
- one export with many private helpers serving different steps: a folder packed into a file
- loose tuning constants, and helpers that quietly read module-level values instead of taking parameters
- module-level mutable state
- long parameter lists, boolean flags, and positional tuples (`[x, y, z]`) crossing file boundaries
- a class mixing pure computation with state changes
- names that describe the mechanics (`solve`, `handle`, `process`) instead of the domain

## 5. Propose the design

Read `references/patterns.md`. For each finding, pick the pattern that fits this code and say why. Don't list patterns that don't apply. Prefer the smallest change that makes the job readable from the surface.

## 6. Report

Use this shape, ranking files and findings by how much they slow a reader down:

```
## <path>
Job (from the surface): <one sentence, or "can't tell">
Steps (from the surface): <list, or "can't tell">

Findings
1. <what blocks reading> (<rule, or "no rule yet">) at <file:line>

Proposed shape
<before/after outline: files, exports, and the entry's named steps. Signatures only, no bodies>

Encode
- <findings that should become a lint rule or a rules.md line, so the next assessment doesn't need to repeat them>
```

End by asking whether to apply the proposed shape. Apply it only on a yes.
