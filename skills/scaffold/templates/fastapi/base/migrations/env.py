"""Alembic environment. Runs migrations over the app's async engine, using `Table.metadata`."""

import asyncio

from alembic import context
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.settings import Settings
from app.core.table import Table

__MODEL_IMPORTS__


def run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=Table.metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_online() -> None:
    engine = create_async_engine(Settings().database_url)
    async with engine.connect() as connection:
        await connection.run_sync(run_migrations)
    await engine.dispose()


asyncio.run(run_online())
