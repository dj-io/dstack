import { type NextRequest, NextResponse } from 'next/server';
import { createPkcePair } from '@/lib/oauth/createPkcePair';
import { oauthConfig } from '@/lib/oauth/oauthConfig';
import { getSession } from '@/lib/session/getSession';

export async function GET(request: NextRequest) {
  const config = oauthConfig();
  const { verifier, challenge } = await createPkcePair();
  const state = crypto.randomUUID();

  const session = await getSession();
  session.pendingLogin = { state, verifier };
  await session.save();

  const url = new URL(config.authorizeUrl);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
    scope: config.scope,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  return NextResponse.redirect(url);
}
