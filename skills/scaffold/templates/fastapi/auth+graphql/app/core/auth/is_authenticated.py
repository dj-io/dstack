from typing import Any

from fastapi import HTTPException
from strawberry.permission import BasePermission
from strawberry.types import Info


class IsAuthenticated(BasePermission):
    """Strawberry permission: puts the signed-in user in `info.context["user"]`, or denies.

    Use it as `@strawberry.field(permission_classes=[IsAuthenticated])`.
    """

    message = "Not authenticated"

    async def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:
        try:
            token = info.context["request"].headers["authorization"].removeprefix("Bearer ")
            info.context["user"] = await info.context["current_user"].verify(token)
        except (KeyError, HTTPException):
            return False
        return True
