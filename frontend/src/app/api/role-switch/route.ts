import type { NextRequest } from 'next/server';
import { jsonError, jsonOk, upstreamRequest } from '@/shared/lib/server-upstream';
import { getSessionToken, setSession } from '@/features/auth/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type SwitchableRole = 'MEMBER' | 'VOLUNTEER';

interface RoleSwitchBody {
  role?: string;
}

interface RoleSwitchEnvelope {
  data?: {
    token: string;
    activeRole: SwitchableRole;
    accountRole: string;
    mode: 'ACCOUNT' | 'SWITCHED';
    capabilities: Record<string, boolean>;
    note: string;
  };
}

/**
 * POST /api/role-switch
 *
 * Delegates to the backend so the active role is signed into a fresh JWT.
 * The new token is stored in the httpOnly session cookie; the client never
 * sees or claims a role by itself.
 */
export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return jsonError('Sesi tidak ditemukan. Silakan masuk kembali.', 401);
  }

  let body: RoleSwitchBody | null = null;
  try {
    body = (await request.json()) as RoleSwitchBody;
  } catch {
    return jsonError('Body permintaan tidak valid (JSON diperlukan).', 400);
  }

  const requested = (body?.role ?? '').toUpperCase();
  if (requested !== 'MEMBER' && requested !== 'VOLUNTEER') {
    return jsonError(
      'Peran tujuan tidak valid. Pilihan yang tersedia: MEMBER atau VOLUNTEER.',
      400,
    );
  }

  const result = await upstreamRequest<RoleSwitchEnvelope>('/auth/role-switch', {
    method: 'POST',
    token,
    body: { role: requested },
  });

  const data = result.data?.data;
  if (!result.ok || !data) {
    return jsonError(
      result.error ?? 'Gagal mengganti peran.',
      result.status || 502,
    );
  }

  await setSession(data.token, data.activeRole);

  return jsonOk({
    activeRole: data.activeRole,
    accountRole: data.accountRole,
    mode: data.mode,
    persisted: true,
    capabilities: data.capabilities,
    note: data.note,
  });
}
