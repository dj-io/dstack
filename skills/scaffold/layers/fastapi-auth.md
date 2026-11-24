# Auth layer (FastAPI)

Verifies WorkOS access tokens. Sign-in itself happens in the client (AuthKit). The API checks the bearer token it receives.

## Adds

```
app/core/auth/auth_settings.py   AuthSettings (WORKOS_*)
app/core/auth/auth_user.py       AuthUser, parsed from verified token claims
app/core/auth/access_tokens.py   AccessTokens: checks the token against WorkOS's published keys
app/core/auth/current_user.py    CurrentUser: the FastAPI dependency, 401 on a bad token
```

With `graphql`, the `auth+graphql` combination also adds `app/core/auth/is_authenticated.py` (a Strawberry permission) and `app/graphql/context.py`.

## Steps

1. If the request names a WorkOS project, put its client ID in `.env`. Otherwise leave the placeholder.
2. Protect a REST route by nesting it in the router's `__init__` with `user: Annotated[AuthUser, Depends(current_user)]`. `BillingRouter` shows the pattern. Build `CurrentUser` once in `app/main.py` and pass it to each router that needs it.

## Tell the user

- They need to set `WORKOS_CLIENT_ID`, and `WORKOS_ISSUER` if their tokens use a custom auth domain, in `.env`.
- Token verification has been checked only for its 401 paths here. The first real sign-in is the test that the issuer and audience match their WorkOS setup.
