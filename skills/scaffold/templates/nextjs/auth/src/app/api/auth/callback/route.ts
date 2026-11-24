import { type NextRequest, NextResponse } from 'next/server';
import { exchangeCode } from '@/lib/oauth/exchangeCode';
import { fetchUser } from '@/lib/oauth/fetchUser';
import { getSession } from '@/lib/session/getSession';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const session = await getSession();
  const pending = session.pendingLogin;

  if (!code || !pending || state !== pending.state) {
    return NextResponse.json({ error: 'Invalid OAuth callback' }, { status: 400 });
  }

  const accessToken = await exchangeCode(code, pending.verifier, `${request.nextUrl.origin}/api/auth/callback`);
  session.user = await fetchUser(accessToken);
  session.pendingLogin = undefined;
  await session.save();

  return NextResponse.redirect(new URL('/', request.nextUrl.origin));
}
