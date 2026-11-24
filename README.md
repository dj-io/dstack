# dstack

DJ's opinionated skills for Claude Code, in the spirit of gstack and pstack. Recipes hold the defaults, scripts and templates handle the steps that should come out the same every time, and lint rules enforce the conventions that tools can check.

## Skills

| Skill | What it does |
|---|---|
| `/dstack:scaffold` (`/scaffold` in Cursor) | Starts a project from a recipe, with conventions, lint rules and rule tests wired in. Runs only when typed. |
| `nextjs-conventions` | The Next.js code rules. Claude applies it when writing code in a Next.js project. |

### Recipes

- `nextjs`: Next.js App Router with SWC, StyleX, Base UI. Optional layers: `auth` (iron-session + OAuth with PKCE) and `docs` (`@next/mdx`).

## Requirements

- Claude Code or Cursor
- Node.js 22.13 or later (the scaffold script runs on Node, and iron-session 9 requires 22.13)
- pnpm 11. The templates were tested on 11.23, and `pnpm-workspace.yaml` uses pnpm 11's `allowBuilds`
- git

## Install

### Claude Code

```
/plugin marketplace add dj-io/dstack
/plugin install dstack@dstack
```

To pick up a new version, run `/plugin marketplace update dstack`.

### Cursor

Cursor has no install-from-URL for individual users. Use whichever route fits:

- **Local:** clone into Cursor's local plugins folder, then run **Developer: Reload Window**. dstack then shows up under Customize.

  ```bash
  git clone https://github.com/dj-io/dstack.git ~/.cursor/plugins/local/dstack
  ```

  Update with `git -C ~/.cursor/plugins/local/dstack pull`.
- **Team (Teams/Enterprise):** go to Dashboard → Plugins & MCPs → Add Marketplace → Import from Repo, and enter `https://github.com/dj-io/dstack`.
- **Public:** submit the repo at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Cursor reviews every plugin and requires it to be open source.

Both tools read the same `skills/` folder. Each has its own manifest (`.claude-plugin/plugin.json` and `.cursor-plugin/plugin.json`). Keep their `version` fields in sync.

## Layout

```
.claude-plugin/        plugin.json, marketplace.json (Claude Code)
.cursor-plugin/        plugin.json (Cursor)
skills/scaffold/
  SKILL.md             entry point: read request → ask at real forks → recipe → verify → present
  recipes/<recipe>.md  stack, layer table, steps, known constraints
  layers/              one file per optional layer
  templates/<recipe>/  base/ plus one folder per layer (layer.json merges dependencies)
  bin/scaffold.mjs     copies templates, merges layers, fills names, writes AGENTS.md and dstack.json
skills/nextjs-conventions/
  rules.md             the conventions, copied into each scaffolded project's AGENTS.md
                       (its CLAUDE.md is one line, @AGENTS.md, so both tools read the same file)
```

## Personal defaults

`~/.claude/rules/dstack.md` (Claude Code) or `~/.cursor/rules/dstack.mdc` (Cursor) holds one `key: value` per line and overrides a recipe default with the same key. Delete a line to go back to the default.

## Adding a recipe

1. Add `skills/scaffold/templates/<recipe>/base/` (and any layer folders), then `recipes/<recipe>.md`.
2. Add `skills/<recipe>-conventions/rules.md` if the recipe has its own conventions.
3. Scaffold a test project and get its verify command passing before committing.
