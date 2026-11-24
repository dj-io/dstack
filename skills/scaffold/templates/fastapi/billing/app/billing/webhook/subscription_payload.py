from pydantic import BaseModel


class SubscriptionPayload(BaseModel):
    """The fields we read from a Stripe subscription object, parsed once at the edge."""

    customer: str
    status: str
