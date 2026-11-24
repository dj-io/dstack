import type { SessionData } from '@/lib/session/SessionData';
import { oauthConfig } from './oauthConfig';

type User = NonNullable<SessionData['user']>;

/**
 * Loads the signed-in user from the userinfo endpoint. The field mapping
 * assumes OpenID Connect claims; change it here for providers like GitHub.
 */
export async function fetchUser(accessToken: string): Promise<User> {
  const response = await fetch(oauthConfig().userinfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Userinfo request failed: ${response.status}`);
  const claims = (await response.json()) as { sub: string; email?: string; name?: string };
  return { id: claims.sub, email: claims.email, name: claims.name };
}
