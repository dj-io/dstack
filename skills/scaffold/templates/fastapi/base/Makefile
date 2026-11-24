.PHONY: verify lint typecheck test up down migrate migration

# Everything that must pass before a change is done.
verify: lint typecheck test

lint:
	uv run ruff check .
	uv run ruff format --check .

typecheck:
	uv run mypy .

test:
	uv run pytest

up:
	docker compose up --build

down:
	docker compose down

migrate:
	docker compose run --rm api alembic upgrade head

migration:
	docker compose run --rm api alembic revision --autogenerate -m "$(name)"
