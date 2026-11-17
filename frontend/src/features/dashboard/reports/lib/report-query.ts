import type { QueryParams } from '@/shared/lib/same-origin';
import type { AttendanceFilters } from '../types/report.types';

export function attendanceParams(filters: AttendanceFilters): QueryParams {
  return {
    from: filters.from || undefined,
    to: filters.to || undefined,
    eventId: filters.eventId || undefined,
  };
}
