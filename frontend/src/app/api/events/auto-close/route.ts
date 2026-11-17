import type { NextRequest } from 'next/server';
import { jsonError, jsonOk } from '@/shared/lib/server-upstream';
import { resolveRequestToken } from '@/features/auth/lib/session';
import { loadAutoCloseStates } from '@/features/events/api/events.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = await resolveRequestToken(request);
  const result = await loadAutoCloseStates(token);

  if (!result.ok || !result.data) {
    return jsonError(
      result.error ?? 'Gagal mengevaluasi status kegiatan.',
      result.status
    );
  }

  return jsonOk(result.data);
}
