const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. See .env.example.`);
  return value;
};

/** Provider settings, read at call time so a missing variable fails the request, not the build. */
export function oauthConfig() {
  return {
    clientId: required('OAUTH_CLIENT_ID'),
    clientSecret: required('OAUTH_CLIENT_SECRET'),
    authorizeUrl: required('OAUTH_AUTHORIZE_URL'),
    tokenUrl: required('OAUTH_TOKEN_URL'),
    userinfoUrl: required('OAUTH_USERINFO_URL'),
    scope: process.env.OAUTH_SCOPE ?? 'openid email profile',
  };
}
