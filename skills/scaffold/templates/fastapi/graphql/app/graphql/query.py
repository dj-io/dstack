import strawberry

from app.health.query import HealthQuery


@strawberry.type
class Query(HealthQuery):
    """Root query. Each feature adds its query type to the bases."""
