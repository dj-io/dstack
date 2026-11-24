from pydantic import BaseModel, ConfigDict, Field


class AuthUser(BaseModel):
    """The signed-in user, parsed once from a verified WorkOS access token's claims."""

    model_config = ConfigDict(frozen=True, populate_by_name=True)

    id: str = Field(alias="sub")
    session_id: str | None = Field(default=None, alias="sid")
    organization_id: str | None = Field(default=None, alias="org_id")
