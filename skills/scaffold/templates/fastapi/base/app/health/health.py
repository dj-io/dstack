from app.health.health_status import HealthStatus


class Health:
    """Answers liveness checks from Docker and load balancers. It doesn't touch the database."""

    async def status(self) -> HealthStatus:
        return HealthStatus(status="ok")
