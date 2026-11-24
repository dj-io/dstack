---
name: legibility
description: Staff-level developer experience (DX) assessment of TypeScript and Python modules, scripts and APIs. Legibility here means whether a developer can tell what code does, and its main steps, from its exports, names and order alone, without reading the internals. Reports where intent is hidden or boundaries blur, and which design patterns would fix it. Use for /legibility or requests to assess, review or critique the API design, readability or DX of code.
disable-model-invocation: true
argument-hint: "<file or folder>"
---

# Legibility: a DX assessment

This skill assesses developer experience (DX): what it costs a developer to understand code they didn't write. It does not assess runtime behaviour, performance or correctness.

**Legibility** is the property it checks. A file is legible when a developer who opens it can tell what it does, and its main steps, from the surface alone: the export, its signature and JSDoc, the names, and the order things appear in. A file that follows every structural rule (small files, one export) can still fail this, if its intent is buried in private helpers, loose constants and unnamed steps.

So the skill asks one question: can a developer tell what this file does, and how, without reading the helpers? Report what blocks that and the design that would fix it. Don't edit code unless the user asks after reading the report.

## 1. Load the standard

Read the conventions for the target's language in full, relative to this skill's folder:

- TypeScript: `../typescript-conventions/rules.md`, plus `../nextjs-conventions/rules.md` in a Next.js project.
- Python: `../python-conventions/rules.md`, plus `../fastapi-conventions/rules.md` in a FastAPI project. In Python, "the surface" is a module's public class and its public methods.

Every finding cites the rule it breaks, or says plainly that no rule covers it yet.

## 2. Map the target

- For a folder, start from its entry: the file other code imports, or the script that runs. Follow imports inward, but stay inside the target.
- For each file, record its export, its private top-level helpers, its module-level constants and state, and what it imports.
- If the project has the dstack checks, run them and take their output as given: `pnpm lint` when `eslint/rules/export-first.mjs` exists, `make verify` when `tests/guards/` exists. Spend your judgment on what they can't see.

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
Verdict: <Legible | Partly legible | Opaque>
Job (from the surface): <one sentence, or "can't tell">
Steps (from the surface): <list, or "can't tell">

Findings
1. <what blocks reading> (<rule, or "no rule yet">) at <file:line>

Proposed shape
<before/after outline: files, exports, and the entry's named steps. Signatures only, no bodies>

Encode
- <findings that should become a lint rule or a rules.md line, so the next assessment doesn't need to repeat them>
```

The verdict comes from step 3:

- **Legible:** the job and the steps are both clear from the surface, and the body matches them.
- **Partly legible:** the job is clear from the surface, but the steps aren't, or the body does more than the surface says.
- **Opaque:** you can't state the job from the surface.

End by asking whether to apply the proposed shape. Apply it only on a yes.
