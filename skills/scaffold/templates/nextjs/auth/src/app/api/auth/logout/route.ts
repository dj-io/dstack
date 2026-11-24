import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session/getSession';

export async function POST(request: NextRequest) {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL('/', request.nextUrl.origin), { status: 303 });
}
