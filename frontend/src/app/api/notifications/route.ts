import type { NextRequest } from 'next/server';
import { jsonError, jsonOk } from '@/shared/lib/server-upstream';
import { resolveRequestToken } from '@/features/auth/lib/session';
import { loadNotificationsFeed } from '@/features/notifications/api/notifications.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = await resolveRequestToken(request);
  if (!token) {
    return jsonError(
      'Token autentikasi tidak ditemukan. Silakan masuk kembali.',
      401
    );
  }

  const result = await loadNotificationsFeed(token);
  if (!result.ok || !result.data) {
    return jsonError(
      result.error ?? 'Gagal memuat notifikasi aktivitas.',
      result.status
    );
  }

  return jsonOk(result.data);
}
