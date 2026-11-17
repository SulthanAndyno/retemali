import 'server-only';

const FALLBACK_API_URL = 'http://localhost:2000/api';

/** Server-only API base URL; API_URL takes precedence over the public URL. */
export const SERVER_API_BASE_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  FALLBACK_API_URL
).replace(/\/$/, '');
