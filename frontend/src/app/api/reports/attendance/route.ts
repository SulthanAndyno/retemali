import type { NextRequest } from 'next/server';
import { jsonError, jsonOk } from '@/shared/lib/server-upstream';
import { resolveRequestToken } from '@/features/auth/lib/session';
import {
  loadAttendanceReport,
  readAttendanceFilters,
} from '@/features/dashboard/reports/api/attendance.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = await resolveRequestToken(request);
  if (!token) {
    return jsonError('Token autentikasi tidak ditemukan. Silakan masuk kembali.', 401);
  }

  const result = await loadAttendanceReport(token, readAttendanceFilters(request));
  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  return jsonOk(result.data);
}
