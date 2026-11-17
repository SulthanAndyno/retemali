const FALLBACK_API_URL = 'http://localhost:2000/api';

/** Client-safe API base URL from NEXT_PUBLIC_API_URL. */
export const PUBLIC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_URL
).replace(/\/$/, '');
