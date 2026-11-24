from typing import Annotated

import stripe
from fastapi import Header, HTTPException, Request, status

from app.billing.stripe_gateway import StripeGateway
from app.billing.webhook.event_handlers import EventHandlers
from app.billing.webhook.event_log import EventLog
from app.billing.webhook.webhook_receipt import WebhookReceipt
from app.core.database import Database


class Webhook:
    """Receives Stripe events: verify the signature, then record and apply in one transaction.

    If applying fails, the record rolls back too, so Stripe's retry gets another chance.
    """

    def __init__(self, database: Database, stripe: StripeGateway) -> None:
        self._database = database
        self._stripe = stripe
        self._log = EventLog()
        self._handlers = EventHandlers()

    async def receive(
        self, request: Request, stripe_signature: Annotated[str, Header()]
    ) -> WebhookReceipt:
        event = self._verified(await request.body(), stripe_signature)
        async with self._database.session() as session:
            if not await self._log.record(session, event):
                return WebhookReceipt(status="duplicate")
            await self._handlers.apply(session, event)
            await session.commit()
        return WebhookReceipt(status="applied")

    def _verified(self, payload: bytes, signature: str) -> stripe.Event:
        try:
            return self._stripe.parse_event(payload, signature)
        except (stripe.SignatureVerificationError, ValueError) as error:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid Stripe signature") from error
