from pydantic_settings import BaseSettings, SettingsConfigDict


class BillingSettings(BaseSettings):
    """Stripe settings, read from `STRIPE_*` environment variables."""

    model_config = SettingsConfigDict(env_prefix="STRIPE_", env_file=".env", extra="ignore")

    secret_key: str = ""
    webhook_secret: str = ""
    price_id: str = ""
    success_url: str = "http://localhost:3000/billing/success"
    cancel_url: str = "http://localhost:3000/billing"
