from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.billing.customer_table import CustomerTable
from app.billing.stripe_gateway import StripeGateway
from app.core.database import Database


class Customers:
    """Finds or creates the Stripe customer for a user.

    Safe under concurrent requests: Stripe's idempotency key returns the same customer for the
    same user, and the insert ignores a row that already exists.
    """

    def __init__(self, database: Database, stripe: StripeGateway) -> None:
        self._database = database
        self._stripe = stripe

    async def stripe_id_for(self, user_id: str) -> str:
        async with self._database.session() as session:
            existing = await session.scalar(
                select(CustomerTable.stripe_customer_id).where(CustomerTable.user_id == user_id)
            )
        if existing is not None:
            return existing
        return await self._create(user_id)

    async def _create(self, user_id: str) -> str:
        stripe_customer_id = await self._stripe.create_customer(user_id)
        async with self._database.session() as session:
            await session.execute(
                insert(CustomerTable)
                .values(user_id=user_id, stripe_customer_id=stripe_customer_id)
                .on_conflict_do_nothing(index_elements=[CustomerTable.user_id])
            )
            await session.commit()
        return stripe_customer_id
