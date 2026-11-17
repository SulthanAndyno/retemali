import type { NextRequest } from 'next/server';
import { jsonError, jsonOk } from '@/shared/lib/server-upstream';
import { getSessionToken, setSession } from '@/features/auth/lib/session';
import { switchActiveRole } from '@/features/auth/api/auth.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return jsonError('Sesi tidak ditemukan. Silakan masuk kembali.', 401);
  }

  let body: { role?: string } | null = null;
  try {
    body = (await request.json()) as { role?: string };
  } catch {
    return jsonError('Body permintaan tidak valid (JSON diperlukan).', 400);
  }

  const result = await switchActiveRole(token, body?.role ?? '');
  if (!result.ok || !result.data) {
    return jsonError(result.error ?? 'Gagal mengganti peran.', result.status);
  }

  await setSession(result.data.token, result.data.activeRole);

  return jsonOk({
    activeRole: result.data.activeRole,
    accountRole: result.data.accountRole,
    mode: result.data.mode,
    persisted: true,
    capabilities: result.data.capabilities,
    note: result.data.note,
  });
}
