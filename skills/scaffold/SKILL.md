---
name: scaffold
description: Start a new project from a dstack recipe (Next.js sites, FastAPI APIs), with the conventions, lint rules and guard tests wired in. Use for /scaffold or requests to start, bootstrap or set up a new site, landing page, docs site, API or backend.
disable-model-invocation: true
argument-hint: "<what you're building> [name] [folder]"
---

# Scaffold

Templates and `bin/scaffold.mjs` do every step that should come out the same each run. You pick the inputs, write the parts specific to this project, verify, and report.

## 1. Read the request

Settle these from the request before doing anything:

- **Recipe.** The `recipes/*.md` that fits: `nextjs` for sites, `fastapi` for Python APIs. If nothing fits, say so and stop.
- **Name.** A slug of lowercase letters, digits and dashes. Take it from the request, else from the target folder.
- **Target folder.** Use the one given. If none is given and the current folder is empty, use it. Otherwise ask (step 2).
- **Layers.** Each recipe has a table of layers. Pick by the signals it lists, or by the answers to its questions.
- **User defaults.** Read `~/.claude/rules/dstack.md` (Claude Code) or `~/.cursor/rules/dstack.mdc` (Cursor), whichever exists. Each `key: value` line overrides the recipe default of the same name. A missing line means the recipe default.

## 2. Ask only at real forks

Proceed, then present. Ask only when:

- no recipe fits, or two do
- the target folder is unclear
- the request contradicts a recipe default (e.g. "use Tailwind")
- the recipe has a **Questions** section and the request doesn't answer one of them. Ask all of that recipe's open questions together, in one prompt

Use the harness's question tool (AskUserQuestion in Claude Code, AskQuestion in Cursor), or plain text if there is none. Put the recommended option first and mark it "(Recommended)". Decide everything else yourself and list those decisions in step 5. Never ask the user to confirm defaults.

## 3. Run the recipe

Read `recipes/<recipe>.md` in full and follow it. For each chosen layer, read `layers/<recipe>-<layer>.md` in full. Before writing any code, read the conventions skills listed in `templates/<recipe>/conventions.json`, in order.

## 4. Verify

The recipe names a verify command. It must pass before you report.

If a failure comes from the template itself rather than your edits, fix it in the project. Then tell the user which file under `templates/` needs the same fix, so the next scaffold doesn't repeat it.

## 5. Present

Keep it short:

- path, recipe and layers
- each decision you made without asking, with one line on why
- what the user still has to fill in (secrets, provider settings)
- the command to start, as the recipe gives it (`pnpm dev` for nextjs, `make up` for fastapi)

## Never

- push, create a remote repo, deploy, or set real secrets
- write into a non-empty folder. The script refuses, so don't work around it
- regenerate a file the templates provide. Copy it, then edit it
