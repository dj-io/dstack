# dstack

DJ's opinionated skills for Claude Code, in the spirit of gstack and pstack. Recipes hold the defaults, scripts and templates handle the steps that should come out the same every time, and lint rules enforce the conventions that tools can check.

## Skills

| Skill | What it does |
|---|---|
| `/dstack:scaffold` (`/scaffold` in Cursor) | Starts a project from a recipe, with conventions, lint rules and rule tests wired in. Runs only when typed. |
| `/dstack:legibility` (`/legibility` in Cursor) | A developer experience (DX) assessment. It checks whether a developer can tell what a module does, and its main steps, from its exports and names alone, gives each file a verdict (Legible, Partly legible, Opaque), and proposes design patterns to fix it. Reports first and changes code only on request. Runs only when typed. |
| `typescript-conventions` | The TypeScript rules, including how logic files should read. The agent applies them when writing TypeScript. |
| `nextjs-conventions` | The Next.js rules, built on the TypeScript ones. The agent applies them in Next.js projects. |
| `python-conventions` | The Python rules, drawn from grit-sdk: classes own behaviour, one public class per module, one guarding `if` per function, parse at the edge. The agent applies them when writing Python. |
| `fastapi-conventions` | The FastAPI rules, built on the Python ones and drawn from grit-agents. The agent applies them in FastAPI projects. |

### Recipes

- `nextjs`: Next.js App Router with SWC, StyleX, Base UI. Optional layers: `auth` (iron-session + OAuth with PKCE) and `docs` (`@next/mdx`).
- `fastapi`: FastAPI on Python 3.13 with uv, Postgres (async SQLAlchemy + Alembic) and Docker Compose. It asks about three optional layers: `graphql` (Strawberry), `auth` (WorkOS) and `billing` (Stripe, needs `auth`).

## Requirements

- Claude Code or Cursor
- Node.js 22.13 or later. The scaffold script runs on Node, and iron-session 9 requires 22.13
- git
- For `nextjs`: pnpm 11. The templates were tested on 11.23, and `pnpm-workspace.yaml` uses pnpm 11's `allowBuilds`
- For `fastapi`: uv (tested on 0.12) and Docker with Compose v2.24 or later

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
  recipes/<recipe>.md  stack, questions, layer table, steps, known constraints
  layers/              one file per optional layer
  templates/<recipe>/  base/, one folder per layer, `a+b` folders applied when both layers are
                       chosen, and conventions.json listing which conventions go into AGENTS.md
  bin/scaffold.mjs     copies templates and layers, fills slots and names, writes AGENTS.md
                       and dstack.json (its header documents layer.json and slots)
skills/typescript-conventions/   TypeScript rules, including logic files
skills/nextjs-conventions/       Next.js rules, built on the TypeScript ones
skills/python-conventions/       Python rules (from grit-sdk)
skills/fastapi-conventions/      FastAPI rules, built on the Python ones (from grit-agents)
                                 Each recipe's rules are copied into the scaffolded project's
                                 AGENTS.md; its CLAUDE.md is one line, @AGENTS.md
skills/legibility/
  SKILL.md             DX assessment: map the target → state its job from the surface → find what blurs it → verdict and report
  references/patterns.md  the patterns a finding can point to, each with its signal and when to skip it
```

## Personal defaults

`~/.claude/rules/dstack.md` (Claude Code) or `~/.cursor/rules/dstack.mdc` (Cursor) holds one `key: value` per line and overrides a recipe default with the same key. Delete a line to go back to the default.

## Adding a recipe

1. Add `skills/scaffold/templates/<recipe>/base/` (and any layer folders), then `recipes/<recipe>.md`. Where layers need to add lines to a shared file, put a slot marker (`__SLOT_NAME__` alone on a line) in the base file and fill it from each layer's `layer.json`.
2. Add `skills/<recipe>-conventions/rules.md` if the recipe has its own conventions, and list the conventions skills it uses, in order, in `templates/<recipe>/conventions.json`.
3. Scaffold a test project and get its verify command passing before committing.
