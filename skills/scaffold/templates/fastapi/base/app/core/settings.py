from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App-wide settings, read from the environment and `.env`.

    Each layer keeps its own settings class next to the code that uses it.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/app"
    cors_origins: tuple[str, ...] = ("http://localhost:3000",)
