import type { QueryParams } from '@/shared/lib/same-origin';
import type { AttendanceFilters, CashFilters } from '../types/report.types';

export function attendanceParams(filters: AttendanceFilters): QueryParams {
  return {
    from: filters.from || undefined,
    to: filters.to || undefined,
    eventId: filters.eventId || undefined,
  };
}

export function cashParams(filters: CashFilters): QueryParams {
  return {
    from: filters.from || undefined,
    to: filters.to || undefined,
  };
}
