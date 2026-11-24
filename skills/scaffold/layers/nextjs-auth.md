# Auth layer (Next.js)

iron-session cookie sessions, plus a provider-agnostic OAuth 2.0 authorization-code flow with PKCE. It uses no auth library.

## Adds

```
src/lib/session/   SessionData (type), sessionOptions, getSession
src/lib/oauth/     oauthConfig, createPkcePair, exchangeCode, fetchUser
src/app/api/auth/  login (GET), callback (GET), logout (POST)
.env.example       SESSION_PASSWORD and OAUTH_* variables
```

## Steps

1. `cp .env.example .env.local`, then set `SESSION_PASSWORD` in `.env.local` to the output of `openssl rand -base64 32`. This is a local dev value only. Never commit it.
2. If the request names a provider, fill in its `OAUTH_AUTHORIZE_URL`, `OAUTH_TOKEN_URL` and `OAUTH_USERINFO_URL` in `.env.local`. Leave the client ID and secret blank: those belong to the user.
3. `fetchUser` maps OpenID Connect claims (`sub`, `email`, `name`). For a provider that isn't OIDC, such as GitHub, change that mapping in `src/lib/oauth/fetchUser.ts` only.
4. Read the session in server code with `getSession()`. Gate pages in the route or feature that needs it, not globally.

## Tell the user

- They need to add `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` to `.env.local`.
- They need to register `http://localhost:3000/api/auth/callback` as the redirect URI with the provider.
