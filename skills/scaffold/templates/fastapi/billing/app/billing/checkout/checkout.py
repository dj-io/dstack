from app.billing.checkout.checkout_session import CheckoutSession
from app.billing.checkout.customers import Customers
from app.billing.stripe_gateway import StripeGateway
from app.core.auth.auth_user import AuthUser


class Checkout:
    """Starts a Stripe Checkout for the signed-in user's subscription."""

    def __init__(self, customers: Customers, stripe: StripeGateway) -> None:
        self._customers = customers
        self._stripe = stripe

    async def start(self, user: AuthUser) -> CheckoutSession:
        customer_id = await self._customers.stripe_id_for(user.id)
        return CheckoutSession(url=await self._stripe.create_checkout(customer_id))
