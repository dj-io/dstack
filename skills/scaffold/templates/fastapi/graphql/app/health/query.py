import strawberry

from app.health.health import Health


@strawberry.type
class HealthQuery:
    """`{ health }`: the same liveness answer as `GET /health`."""

    @strawberry.field
    async def health(self) -> str:
        return (await Health().status()).status
