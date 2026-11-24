import logging

import stripe
from sqlalchemy.ext.asyncio import AsyncSession

from app.billing.webhook.subscription_changed import SubscriptionChanged

logger = logging.getLogger(__name__)


class EventHandlers:
    """Routes each Stripe event type to the handler that applies it. Other types are ignored."""

    def __init__(self) -> None:
        subscription_changed = SubscriptionChanged()
        self._handlers = {
            "customer.subscription.created": subscription_changed,
            "customer.subscription.updated": subscription_changed,
            "customer.subscription.deleted": subscription_changed,
        }

    async def apply(self, session: AsyncSession, event: stripe.Event) -> None:
        try:
            handler = self._handlers[event.type]
        except KeyError:
            logger.debug("Ignoring Stripe event %s (%s)", event.id, event.type)
            return
        await handler.apply(session, event)
