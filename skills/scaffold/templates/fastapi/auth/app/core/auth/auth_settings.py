from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthSettings(BaseSettings):
    """WorkOS settings, read from `WORKOS_*` environment variables."""

    model_config = SettingsConfigDict(env_prefix="WORKOS_", env_file=".env", extra="ignore")

    client_id: str
    api_key: str = ""
    issuer: str
