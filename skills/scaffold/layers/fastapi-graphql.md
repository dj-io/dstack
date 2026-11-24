# GraphQL layer (FastAPI)

Strawberry GraphQL at `/graphql`, with GraphiQL in the browser.

## Adds

```
app/graphql/router.py   GraphqlRouter (a Strawberry GraphQLRouter)
app/graphql/schema.py   Schema: composes the root types
app/graphql/query.py    Query: inherits every feature's query type
app/health/query.py     HealthQuery: { health }
```

## Steps

1. For each feature the request names, add `app/<feature>/query.py` (and `mutation.py` if it changes data) with a `@strawberry.type` class. Add it to the bases of `Query` in `app/graphql/query.py`. For the first mutation, create `app/graphql/mutation.py` the same way and pass `mutation=Mutation` in `Schema`.
2. Resolvers stay thin, like routes: parse, delegate to the feature's classes, return Strawberry types.
3. With auth, protect a field with `@strawberry.field(permission_classes=[IsAuthenticated])` and read the user from `info.context["user"]`.
