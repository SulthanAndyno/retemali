import 'server-only';
import { cookies } from 'next/headers';
import {
  ROLE_COOKIE,
  SESSION_COOKIE,
  sessionCookieOptions,
} from './session-constants';

export { ROLE_COOKIE, SESSION_COOKIE, sessionCookieOptions };

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getActiveRole(): Promise<string | null> {
  return (await cookies()).get(ROLE_COOKIE)?.value ?? null;
}

export async function setSession(token: string, role: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);
  store.set(ROLE_COOKIE, role, sessionCookieOptions);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ROLE_COOKIE);
}
