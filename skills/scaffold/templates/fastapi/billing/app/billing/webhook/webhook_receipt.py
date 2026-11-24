from pydantic import BaseModel


class WebhookReceipt(BaseModel):
    """Body of `POST /billing/webhook`: `applied` the first time, `duplicate` on a retry."""

    status: str
