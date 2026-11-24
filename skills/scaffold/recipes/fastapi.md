# FastAPI recipe

For Python APIs: backends for web and desktop apps, agents, and services.

## Stack

Fixed. Don't ask about these.

- Python 3.13, managed with uv
- FastAPI, uvicorn, Pydantic settings
- Postgres 17 with async SQLAlchemy 2 and Alembic
- Docker and Docker Compose for local runs
- ruff, mypy (strict), pytest with AST guard tests

## Questions

Ask each of these the request doesn't settle, together in one prompt, recommended option first:

| Question | Options | Layer |
|---|---|---|
| API style | GraphQL with Strawberry (Recommended), REST only | `graphql` |
| Auth | WorkOS (Recommended), none | `auth` |
| Billing | Stripe subscriptions, none (Recommended unless the request mentions payments) | `billing` (needs `auth`) |

REST is always there for `/health` and webhooks. GraphQL adds `/graphql` alongside it.

## Layers

| Layer | Adds | Notes |
|---|---|---|
| `graphql` | Strawberry schema at `/graphql`, `HealthQuery` | `layers/fastapi-graphql.md` |
| `auth` | WorkOS access-token verification, the `CurrentUser` dependency | `layers/fastapi-auth.md` |
| `billing` | Stripe Checkout, an idempotent webhook, billing tables | `layers/fastapi-billing.md` |

With `graphql` and `auth` together, the `auth+graphql` combination also adds the `IsAuthenticated` permission and a GraphQL context carrying `current_user`.

## Steps

1. Copy the templates:
   `node <this skill's folder>/bin/scaffold.mjs --recipe fastapi --name <name> --target <folder> [--layers graphql,auth,billing]`
2. `cd <folder> && uv sync`. This creates `uv.lock`, which the Docker build needs.
3. `uv run ruff check --fix . && uv run ruff format .` sorts the imports that layers added through slots.
4. `cp .env.example .env`.
5. For each feature the request names, add `app/<feature>/` with a `router.py` entry class and wire it in `app/main.py`. Don't add features the request didn't name.
6. Do each layer's steps.
7. `make verify` must pass. It runs ruff, mypy and pytest.
8. Boot it: `docker compose up -d --build`, then `curl localhost:8000/health`. If the host ports are taken, set `DB_PORT` and `API_PORT` in `.env`. Run `docker compose down` when done.
9. `git init && git add -A && git commit -m "Scaffold <name> with dstack fastapi"`

## What the template gives you

```
app/main.py         composition root: settings, database, routers, built once
app/api.py          the FastAPI app: lifespan, CORS, routers
app/core/           Settings, Database, Table (the SQLAlchemy base)
app/health/         HealthRouter → Health → HealthStatus, the example feature
migrations/         Alembic, async, reading Table.metadata
tests/guards/       nine AST guards, each with a sample violation it must catch:
                    no barrels, no free functions, one if, one stream owner,
                    one public class, public methods first, one-way imports,
                    no module mutable state, module comments are docstrings
Dockerfile          python:3.13-slim + uv, non-root user
docker-compose.yml  db (healthchecked) + api (runs migrations, then uvicorn --reload)
Makefile            verify, up, down, migrate, migration name=...
AGENTS.md           python-conventions + fastapi-conventions (per conventions.json)
CLAUDE.md           one line, @AGENTS.md
```

## Constraints behind the template

These were found by building it. Keep them unless you've re-tested:

- Routers subclass `APIRouter`. Returning a router from `__new__`, as grit-sdk does for tools, needs a `type: ignore` under mypy strict.
- A route that needs a runtime dependency (like `CurrentUser`) is a function nested in the router's `__init__`, so `Depends(current_user)` can close over the instance. The free-function guard allows functions nested in a class.
- The WorkOS SDK refuses an empty client ID, so `.env.example` ships `WORKOS_CLIENT_ID=client_replace_me` and the app boots before real keys exist. Stripe accepts an empty key.
- Host ports come from `DB_PORT` and `API_PORT`, because several of these projects often run side by side.
