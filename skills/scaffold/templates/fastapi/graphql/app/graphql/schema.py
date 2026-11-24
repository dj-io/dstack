import strawberry

from app.graphql.query import Query


class Schema(strawberry.Schema):
    """Every feature's GraphQL types, composed into one schema."""

    def __init__(self) -> None:
        super().__init__(query=Query)
