import asyncio

import jwt
from workos import WorkOSClient

from app.core.auth.auth_settings import AuthSettings
from app.core.auth.auth_user import AuthUser


class AccessTokens:
    """Verifies WorkOS access tokens against WorkOS's published signing keys.

    Keys are fetched once and cached by `PyJWKClient`. The fetch is blocking, so it runs
    in a thread.
    """

    def __init__(self, settings: AuthSettings | None = None) -> None:
        self._settings = settings or AuthSettings()
        workos = WorkOSClient(api_key=self._settings.api_key, client_id=self._settings.client_id)
        self._keys = jwt.PyJWKClient(workos.user_management.get_jwks_url())

    async def verify(self, token: str) -> AuthUser:
        key = await asyncio.to_thread(self._keys.get_signing_key_from_jwt, token)
        claims = jwt.decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=self._settings.client_id,
            issuer=self._settings.issuer,
        )
        return AuthUser.model_validate(claims)
