from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth.access_tokens import AccessTokens
from app.core.auth.auth_user import AuthUser


class CurrentUser:
    """FastAPI dependency for the signed-in user. Missing or invalid bearer tokens get a 401.

    Use it as `user: Annotated[AuthUser, Depends(current_user)]`.
    """

    def __init__(self, tokens: AccessTokens | None = None) -> None:
        self._tokens = tokens or AccessTokens()

    async def __call__(
        self, credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())]
    ) -> AuthUser:
        return await self.verify(credentials.credentials)

    async def verify(self, token: str) -> AuthUser:
        try:
            return await self._tokens.verify(token)
        except jwt.PyJWTError as error:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                "Invalid access token",
                headers={"WWW-Authenticate": "Bearer"},
            ) from error
