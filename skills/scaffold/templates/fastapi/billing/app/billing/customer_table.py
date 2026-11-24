from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.table import Table


class CustomerTable(Table):
    """One row per user who has started checkout: their Stripe customer and subscription status."""

    __tablename__ = "billing_customers"

    user_id: Mapped[str] = mapped_column(String, primary_key=True)
    stripe_customer_id: Mapped[str] = mapped_column(String, unique=True)
    subscription_status: Mapped[str] = mapped_column(String, default="none")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
