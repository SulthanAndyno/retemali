import type { NextRequest } from 'next/server';
import { jsonError } from '@/shared/lib/server-upstream';
import { xlsxResponse } from '@/shared/lib/xlsx';
import { resolveRequestToken } from '@/features/auth/lib/session';
import {
  buildAttendanceWorkbook,
  loadAttendanceReport,
  readAttendanceFilters,
} from '@/features/dashboard/reports/api/attendance.server';
import { exportStamp } from '@/features/dashboard/reports/lib/xlsx-report';

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

  const workbook = buildAttendanceWorkbook(result.data);
  return xlsxResponse(workbook, `laporan-presensi-${exportStamp()}.xlsx`);
}
