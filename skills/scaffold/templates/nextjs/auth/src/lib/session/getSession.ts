import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { SessionData } from './SessionData';
import { sessionOptions } from './sessionOptions';

/** Reads the session in Server Components, Server Actions and route handlers. */
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
