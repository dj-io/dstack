---
name: python-conventions
description: DJ's Python code conventions, drawn from grit-sdk. Covers features as folders, classes that own behaviour (no module-level functions), one public class per module, empty __init__.py files, public methods first, one guarding if per function, parsing at the edge into frozen dataclasses, and tests that enforce rules or cover regressions. Apply when writing, moving or reviewing Python code.
---

# Python conventions

Read `rules.md` in this folder in full before writing code.

Projects scaffolded by dstack carry the same rules in their `AGENTS.md`, along with guard tests and lint settings that enforce the ones marked **(guard)** or **(lint)**. Run `make verify` after each change rather than checking those rules by eye. To assess the legibility (DX) of existing code, the user can run `/dstack:legibility`.

When a project's code and these rules disagree, follow the rules for new code. Leave a refactor of the old code to the user's call.
