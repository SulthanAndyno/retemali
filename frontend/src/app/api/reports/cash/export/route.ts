import type { NextRequest } from 'next/server';
import { jsonError } from '@/shared/lib/server-upstream';
import { xlsxResponse } from '@/shared/lib/xlsx';
import { resolveRequestToken } from '@/features/auth/lib/session';
import {
  buildCashWorkbook,
  loadCashReport,
  readCashFilters,
} from '@/features/dashboard/reports/api/cash.server';
import { exportStamp } from '@/features/dashboard/reports/lib/xlsx-report';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = await resolveRequestToken(request);
  if (!token) {
    return jsonError('Token autentikasi tidak ditemukan. Silakan masuk kembali.', 401);
  }

  const result = await loadCashReport(token, readCashFilters(request));
  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  const workbook = buildCashWorkbook(result.data);
  return xlsxResponse(workbook, `laporan-kas-${exportStamp()}.xlsx`);
}
