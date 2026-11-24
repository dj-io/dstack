from pydantic import BaseModel


class CheckoutSession(BaseModel):
    """Body of `POST /billing/checkout`: the Stripe-hosted page to send the user to."""

    url: str
