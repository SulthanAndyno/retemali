import { get } from '@/lib/api';
import { downloadFile, getJson } from '@/shared/lib/same-origin';
import type { ApiEnvelope } from '@/shared/types/api';
import { attendanceParams, cashParams } from '../lib/report-query';
import type {
  AttendanceFilters,
  AttendanceReport,
  CashFilters,
  CashReport,
  EventOption,
} from '../types/report.types';

export function getAttendanceReport(filters: AttendanceFilters) {
  return getJson<ApiEnvelope<AttendanceReport>>(
    '/api/reports/attendance',
    attendanceParams(filters)
  );
}

export function downloadAttendanceExport(filters: AttendanceFilters) {
  return downloadFile(
    '/api/reports/attendance/export',
    attendanceParams(filters),
    'laporan-presensi.xlsx'
  );
}

export function getCashReport(filters: CashFilters) {
  return getJson<ApiEnvelope<CashReport>>('/api/reports/cash', cashParams(filters));
}

export function downloadCashExport(filters: CashFilters) {
  return downloadFile('/api/reports/cash/export', cashParams(filters), 'laporan-kas.xlsx');
}

export async function getEventOptions(): Promise<EventOption[]> {
  const response = await get<ApiEnvelope<Array<{ id: string; title: string }>>>(
    '/events?limit=100'
  );
  return (response.data ?? []).map((event) => ({ id: event.id, title: event.title }));
}
