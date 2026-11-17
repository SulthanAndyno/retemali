import 'server-only';
import { upstreamRequest } from '@/shared/lib/server-upstream';

export type SwitchableRole = 'MEMBER' | 'VOLUNTEER';

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

export interface RoleSwitchResult {
  ok: boolean;
  status: number;
  error: string | null;
  data: RoleSwitchEnvelope['data'] | null;
}

export async function switchActiveRole(
  token: string,
  requested: string
): Promise<RoleSwitchResult> {
  const role = requested.toUpperCase();
  if (role !== 'MEMBER' && role !== 'VOLUNTEER') {
    return {
      ok: false,
      status: 400,
      error:
        'Peran tujuan tidak valid. Pilihan yang tersedia: MEMBER atau VOLUNTEER.',
      data: null,
    };
  }

  const result = await upstreamRequest<RoleSwitchEnvelope>(
    '/auth/role-switch',
    {
      method: 'POST',
      token,
      body: { role },
    }
  );

  if (!result.ok || !result.data?.data) {
    return {
      ok: false,
      status: result.status || 502,
      error: result.error ?? 'Gagal mengganti peran.',
      data: null,
    };
  }

  return {
    ok: true,
    status: 200,
    error: null,
    data: result.data.data,
  };
}
