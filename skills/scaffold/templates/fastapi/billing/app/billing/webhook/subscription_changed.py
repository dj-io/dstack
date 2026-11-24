import stripe
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.billing.customer_table import CustomerTable
from app.billing.webhook.subscription_payload import SubscriptionPayload


class SubscriptionChanged:
    """Copies a subscription's status onto its customer row."""

    async def apply(self, session: AsyncSession, event: stripe.Event) -> None:
        payload = SubscriptionPayload.model_validate(event.data.object.to_dict())
        await session.execute(
            update(CustomerTable)
            .where(CustomerTable.stripe_customer_id == payload.customer)
            .values(subscription_status=payload.status)
        )
