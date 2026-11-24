from pydantic import BaseModel


class HealthStatus(BaseModel):
    """Body of `GET /health`."""

    status: str
