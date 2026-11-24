from typing import Annotated

from fastapi import APIRouter, Depends

from app.billing.billing_settings import BillingSettings
from app.billing.checkout.checkout import Checkout
from app.billing.checkout.checkout_session import CheckoutSession
from app.billing.checkout.customers import Customers
from app.billing.stripe_gateway import StripeGateway
from app.billing.webhook.webhook import Webhook
from app.core.auth.auth_user import AuthUser
from app.core.auth.current_user import CurrentUser
from app.core.database import Database


class BillingRouter(APIRouter):
    """Entry for billing.

    `POST /billing/checkout` starts a Stripe Checkout for the signed-in user.
    `POST /billing/webhook` receives Stripe events.
    """

    def __init__(
        self,
        database: Database,
        current_user: CurrentUser,
        settings: BillingSettings | None = None,
    ) -> None:
        super().__init__(prefix="/billing", tags=["billing"])
        stripe = StripeGateway(settings or BillingSettings())
        checkout = Checkout(Customers(database, stripe), stripe)

        async def start_checkout(
            user: Annotated[AuthUser, Depends(current_user)],
        ) -> CheckoutSession:
            return await checkout.start(user)

        self.add_api_route("/checkout", start_checkout, methods=["POST"])
        self.add_api_route("/webhook", Webhook(database, stripe).receive, methods=["POST"])
