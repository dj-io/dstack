---
name: escalate-design
description: Produces exactly three design options for the same job, each strictly better than the last, ending at a design a staff architect would merge. Removes accidental control flow (if, match, conditional lookups) and duplicate decisions by branching once at a typed boundary. Use for /escalate-design, requests for three options, a staff architect merge, removing if/match/lookup chains, or reshaping control flow or ownership after a staff-assessment.
disable-model-invocation: true
argument-hint: "<component or function>"
---

# Escalate design

A design skill, not a review. Use it after `/dstack:staff-assessment` or `/dstack:legibility`, or whenever the same behaviour needs a stronger shape. Invent options. Don't implement unless asked.

## The challenge (verbatim)

> show me 3 options, challenge is each has to be better than the last.. no match, no if, not even a conditional lookup .. same job but this time in a manor only a staff architect would merge

## Rules

1. **Same job.** Preserve behaviour unless the user relaxes it.
2. **Exactly three options,** labelled Option 1, 2 and 3. Each must be strictly better than the one before: clearer ownership, less accidental control flow, or fewer passes over the same data.
3. **Escalate by deleting accidental control flow.** Not only `if`, `match`/`switch` and conditional lookups. Also strip second passes over a type or MIME that was already classified, crawling a dict after classifying it, soft passes that hide bugs, and adapters that re-decide what an earlier boundary already decided.
4. **The merge bar.** Option 3 branches once, at a typed boundary. After that the hot path is a map plus methods: polymorphism, or a tagged union whose variants carry their own behaviour (TypeScript discriminated unions with a handler per variant, Python frozen dataclasses with methods). No mini-interpreter over wire JSON in the adapt step.
5. **Ask mode by default.** Give full sketches and wiring. Implement only when the user explicitly asks.

Every option still follows the project's conventions. Read them first: `../typescript-conventions/rules.md` or `../python-conventions/rules.md`, relative to this skill's folder, plus the framework file if one applies.

## Output

For each option:

- **Thesis:** one line on what it deletes compared with the option before.
- **Sketch:** a full implementation sketch of the surface in focus, not just bullets.
- **Wiring:** the minimal caller and import changes that make it mergeable.
- **Comparison:** control flow · ownership · remaining smell.

End with a short ladder table (Option 1 → 2 → 3) and say which one a staff architect would merge.

## Scope

It applies to any implementation smell, though conditionals are the usual way in. Stay inside the component or pipeline under discussion. No drive-by refactors.
