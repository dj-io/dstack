from strawberry.fastapi import GraphQLRouter

from app.graphql.schema import Schema

__GRAPHQL_IMPORTS__


class GraphqlRouter(GraphQLRouter[object, None]):
    """Serves the composed schema at `/graphql`, with GraphiQL in the browser."""

    def __init__(self, schema: Schema | None = None) -> None:
        super().__init__(
            schema or Schema(),
            prefix="/graphql",
            __GRAPHQL_OPTIONS__
        )
