export const SESSION_COOKIE = 'retemali_session';
export const ROLE_COOKIE = 'retemali_role';

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE,
} as const;
