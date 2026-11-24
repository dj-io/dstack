import stripe
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.billing.webhook.event_table import EventTable


class EventLog:
    """Records Stripe events by id, so each one is applied once."""

    async def record(self, session: AsyncSession, event: stripe.Event) -> bool:
        """Returns False when the event was already recorded.

        A concurrent delivery of the same event waits on the primary key until the first
        transaction ends, then sees the conflict.
        """
        inserted = await session.scalar(
            insert(EventTable)
            .values(id=event.id, type=event.type)
            .on_conflict_do_nothing(index_elements=[EventTable.id])
            .returning(EventTable.id)
        )
        return inserted is not None
