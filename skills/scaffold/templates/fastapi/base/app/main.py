"""Composition root: builds every shared dependency once and wires the app. uvicorn serves `app`."""

from app.api import Api
from app.core.database import Database
from app.core.settings import Settings
from app.health.router import HealthRouter

__IMPORTS__

settings = Settings()
database = Database(settings.database_url)
__WIRING__

app = Api(
    settings=settings,
    database=database,
    routers=(
        HealthRouter(),
        __ROUTERS__
    ),
).build()
