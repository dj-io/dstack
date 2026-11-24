## FastAPI conventions

These build on the Python conventions above.

### Layout

- `app/main.py` is the composition root. It builds settings, the database and each router once, and wires them together. It's the only module that constructs shared dependencies.
- `app/api.py` builds the FastAPI app: lifespan, middleware and routers.
- `app/core/` holds shared infrastructure: settings, the database, the table base and, when present, auth.
- `app/<feature>/` is one feature. Its entry is `router.py`, a class whose `__new__` returns the feature's `APIRouter`, built from the classes that own the work.
- `app/graphql/`, when present, composes every feature's Strawberry types into one schema.
- Imports flow one way: `app/main.py`, `app/api.py` and `app/graphql/` → features → `app/core/`. A feature never imports another feature. **(guard)**
- `migrations/` holds Alembic revisions. Every table change ships with one.

### Routes

- Routes stay thin: authenticate, parse, delegate, serialize. No business logic in a router.
- Request and response shapes are Pydantic models (REST) or Strawberry types (GraphQL), never raw dicts.
- Expected client errors become `HTTPException` at the transport boundary. Unexpected ones propagate.
- Use the lifespan, not `@app.on_event`. One `APIRouter` per feature.
- Request-scoped dependencies go through `Depends` with a callable class instance, such as `CurrentUser`.
- Handlers that do I/O are `async def`.

### Data

- Use async SQLAlchemy 2 sessions from `Database.session()`, one session per unit of work.
- Tables live at `app/<feature>/<name>_table.py`, mapped on `app/core/table.py`'s `Table`.
- Enforce concurrency in the database: unique constraints and `INSERT ... ON CONFLICT`, not read-then-write.

### Webhooks

- Verify the signature before anything else.
- Record the event id with `INSERT ... ON CONFLICT DO NOTHING` before acting, so a retried delivery does nothing.
- Dispatch on the event type with a table of handlers, not an `if` chain.
