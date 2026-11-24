"""Billing tables: Stripe customers and applied Stripe events.

Revision ID: 0001_billing
Revises:
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_billing"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "billing_customers",
        sa.Column("user_id", sa.String(), primary_key=True),
        sa.Column("stripe_customer_id", sa.String(), nullable=False, unique=True),
        sa.Column("subscription_status", sa.String(), nullable=False, server_default="none"),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )
    op.create_table(
        "billing_stripe_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column(
            "received_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    op.drop_table("billing_stripe_events")
    op.drop_table("billing_customers")
