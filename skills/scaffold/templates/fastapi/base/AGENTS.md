# __APP_NAME__

Scaffolded by dstack (`dstack.json` records the recipe and layers). Run `make verify` before calling any change done: it lints, typechecks and runs the guard and regression tests. `make up` starts the API and Postgres in Docker.

Rules marked **(guard)** fail a test in `tests/guards/`, and rules marked **(lint)** fail ruff or mypy. The rest are judgment calls, and you own them. To assess a module's legibility (whether a developer can tell what it does from its public surface alone), run `/dstack:legibility <file>`.

__CONVENTIONS__
