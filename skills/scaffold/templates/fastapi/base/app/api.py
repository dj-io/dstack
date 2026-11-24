from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Database
from app.core.settings import Settings


class Api:
    """Builds the FastAPI app: lifespan, CORS, and every feature's router."""

    def __init__(
        self, settings: Settings, database: Database, routers: tuple[APIRouter, ...]
    ) -> None:
        self._settings = settings
        self._database = database
        self._routers = routers

    def build(self) -> FastAPI:
        app = FastAPI(title="__APP_NAME__", lifespan=self._lifespan)
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(self._settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )
        for router in self._routers:
            app.include_router(router)
        return app

    @asynccontextmanager
    async def _lifespan(self, _app: FastAPI) -> AsyncIterator[None]:
        yield
        await self._database.close()
