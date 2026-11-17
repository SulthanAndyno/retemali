import { get } from '@/lib/api';
import { downloadFile, getJson } from '@/shared/lib/same-origin';
import type { ApiEnvelope } from '@/shared/types/api';
import { attendanceParams } from '../lib/report-query';
import type {
  AttendanceFilters,
  AttendanceReport,
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

export async function getEventOptions(): Promise<EventOption[]> {
  const response = await get<ApiEnvelope<Array<{ id: string; title: string }>>>(
    '/events?limit=100'
  );
  return (response.data ?? []).map((event) => ({ id: event.id, title: event.title }));
}
