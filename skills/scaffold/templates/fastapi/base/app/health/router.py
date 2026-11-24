from fastapi import APIRouter

from app.health.health import Health


class HealthRouter(APIRouter):
    """Entry for the health feature: `GET /health`."""

    def __init__(self, health: Health | None = None) -> None:
        super().__init__(tags=["health"])
        self.add_api_route("/health", (health or Health()).status, methods=["GET"])
