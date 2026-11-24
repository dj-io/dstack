---
name: staff-assessment
description: Staff-level assessment of a component (TypeScript or Python). Explains how it works, checks it against the "other devs will laugh at me" test (concurrency, idempotency, boundaries, control flow, async, errors, dependencies, ownership, scale), and ranks the critical fixes. Use for /staff-assessment or requests for a staff review of an implementation.
disable-model-invocation: true
argument-hint: "<file, folder or component>"
---

# Staff assessment

Run a staff-level assessment of the component the user points at. The bar is the **"other devs will laugh at me"** test: would a staff engineer reviewing this approve it, or wince?

This is about hygiene, correctness under real conditions, and implementation quality. For whether a developer can read the code from its surface, use `/dstack:legibility` instead. The two often find different things.

## 1. Load the standard

Read the conventions for the component's language, relative to this skill's folder: `../typescript-conventions/rules.md` (plus `../nextjs-conventions/rules.md` in a Next.js project), or `../python-conventions/rules.md` (plus `../fastapi-conventions/rules.md` in a FastAPI project). If the project has dstack checks, run them (`pnpm lint`, or `make verify`) and take their output as given.

## 2. Work out how it works

Trace the component from its entry: who calls it, what it calls, what state it owns, where data enters and leaves. Write that down before judging anything.

## 3. Run the gates

Check each gate. A hit names the file and line and says what actually goes wrong, not just which rule is broken.

| Gate | Fails when |
|---|---|
| Concurrency | Shared mutable state changes by read-modify-write on a stale read, with no lock, atomic update or database constraint |
| Idempotency | A retriable entrypoint (webhook, job, client retry, registration) does damage when it runs twice |
| Boundaries | Untyped input is checked in more than one place, or raw dicts and JSON travel past the edge |
| Control flow | Nesting past three levels, `if` ladders, or a type decision made twice |
| Ownership | Two classes own the same job, or one decision is made again downstream by an adapter |
| Async | Blocking I/O on the event loop, or I/O that isn't awaited |
| Errors | Broad catches, swallowed errors without a stated tradeoff, or errors logged without context |
| Dependencies | A new wiring pattern where the codebase already has one, or hidden globals instead of constructor injection |
| Scale | Work that grows worse than it needs to: N+1 queries, repeated passes over the same data, unbounded memory |
| Scope | Drive-by refactors, or "clean this up later" left inside the change |

## 4. Report

1. **Verdict:** pass or fail the laugh test, in one line.
2. **How it works:** a short flow, or a table of responsibilities.
3. **Laugh-test hits:** each failing gate, with file and line and what goes wrong.
4. **Critical changes:** ranked fixes that would make it pass. Each one is concrete: what to change, where, and into what shape.

## Next step

- If the main smell is control flow, dual ownership, or a second pass over data an earlier step already classified, offer `/dstack:escalate-design`: three designs, each better than the last.
- If the main smell is that nobody can tell what the code does from its surface, offer `/dstack:legibility`.

Don't change code unless the user asks after reading the report.
