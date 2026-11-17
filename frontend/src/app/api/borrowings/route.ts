import type { NextRequest } from 'next/server';
import { jsonError, jsonOk } from '@/shared/lib/server-upstream';
import { resolveRequestToken } from '@/features/auth/lib/session';
import { loadBorrowings } from '@/features/circulation/api/circulation.server';
import type {
  BorrowingStatusFilter,
} from '@/features/circulation/types/circulation.types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = await resolveRequestToken(request);
  if (!token) {
    return jsonError('Token autentikasi tidak ditemukan. Silakan masuk kembali.', 401);
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1') || 1;
  const status = (searchParams.get('status') ?? 'ALL') as BorrowingStatusFilter;
  const search = searchParams.get('search') ?? '';

  const result = await loadBorrowings(token, { page, status, search });

  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  return jsonOk(result.data);
}
