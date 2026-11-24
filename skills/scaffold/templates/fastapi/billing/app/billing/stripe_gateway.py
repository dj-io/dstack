import stripe

from app.billing.billing_settings import BillingSettings


class StripeGateway:
    """The only class that talks to Stripe. Uses the async client, so calls don't block."""

    def __init__(self, settings: BillingSettings) -> None:
        self._settings = settings
        self._client = stripe.StripeClient(settings.secret_key, http_client=stripe.HTTPXClient())

    async def create_customer(self, user_id: str) -> str:
        customer = await self._client.v1.customers.create_async(
            params={"metadata": {"user_id": user_id}},
            options={"idempotency_key": f"customer-{user_id}"},
        )
        return customer.id

    async def create_checkout(self, customer_id: str) -> str:
        session = await self._client.v1.checkout.sessions.create_async(
            params={
                "mode": "subscription",
                "customer": customer_id,
                "line_items": [{"price": self._settings.price_id, "quantity": 1}],
                "success_url": self._settings.success_url,
                "cancel_url": self._settings.cancel_url,
            }
        )
        if session.url is None:
            raise StripeCheckoutError(session.id)
        return session.url

    def parse_event(self, payload: bytes, signature: str) -> stripe.Event:
        return self._client.construct_event(payload, signature, self._settings.webhook_secret)


class StripeCheckoutError(Exception):
    """Stripe created a Checkout session without a hosted URL."""
