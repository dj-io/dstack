from app.core.auth.current_user import CurrentUser


class GraphqlContext:
    """Adds `current_user` to every GraphQL request's context, for `IsAuthenticated`."""

    def __init__(self, current_user: CurrentUser | None = None) -> None:
        self._current_user = current_user or CurrentUser()

    async def build(self) -> dict[str, object]:
        return {"current_user": self._current_user}
