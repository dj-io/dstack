---
name: fastapi-conventions
description: DJ's FastAPI conventions, built on python-conventions and drawn from grit-agents. Covers the composition root in app/main.py, features under app/<feature> with a router entry class, one-way imports into app/core, thin routes with Pydantic or Strawberry types, async SQLAlchemy with Alembic, and idempotent webhooks. Apply when writing, moving or reviewing code in a FastAPI project, especially one whose dstack.json says "recipe": "fastapi".
---

# FastAPI conventions

Read `../python-conventions/rules.md` first, then `rules.md` in this folder, both in full, before writing code. These rules build on the Python ones.

Projects scaffolded by dstack carry both sets in their `AGENTS.md`, along with guard tests and lint settings that enforce the ones marked **(guard)** or **(lint)**. Run `make verify` after each change rather than checking those rules by eye.

When a project's code and these rules disagree, follow the rules for new code. Leave a refactor of the old code to the user's call.
