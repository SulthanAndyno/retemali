import { get } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type { AdminAttendanceEvent } from '../types/attendance.types';

export function getAttendanceOverview(eventId?: string) {
  const query = eventId ? `?eventId=${encodeURIComponent(eventId)}` : '';
  return get<ApiEnvelope<{ events: AdminAttendanceEvent[] }>>(
    `/events/attendance${query}`
  );
}
