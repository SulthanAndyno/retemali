import { ApiError } from '@/lib/api';

/** Pesan error dari backend bila ada; jika tidak, pakai fallback. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
