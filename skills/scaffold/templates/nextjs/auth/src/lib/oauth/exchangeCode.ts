import { oauthConfig } from './oauthConfig';

/** Trades an authorization code for an access token at the provider's token endpoint. */
export async function exchangeCode(code: string, verifier: string, redirectUri: string): Promise<string> {
  const config = oauthConfig();
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });
  if (!response.ok) throw new Error(`Token exchange failed: ${response.status}`);
  const { access_token: accessToken } = (await response.json()) as { access_token: string };
  return accessToken;
}
