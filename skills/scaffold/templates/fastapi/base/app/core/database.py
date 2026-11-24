from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine


class Database:
    """Owns the async engine and hands out sessions.

    Built once in `app/main.py`. The engine connects on first use, not at startup.
    """

    def __init__(self, url: str) -> None:
        self._engine = create_async_engine(url, pool_pre_ping=True)
        self._sessions = async_sessionmaker(self._engine, expire_on_commit=False)

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        async with self._sessions() as session:
            yield session

    async def close(self) -> None:
        await self._engine.dispose()
