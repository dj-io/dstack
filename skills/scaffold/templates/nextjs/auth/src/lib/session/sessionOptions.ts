import type { SessionOptions } from 'iron-session';

/** iron-session cookie settings. The password comes from SESSION_PASSWORD. */
export const sessionOptions: SessionOptions = {
  cookieName: '__APP_NAME__-session',
  password: process.env.SESSION_PASSWORD ?? '',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};
