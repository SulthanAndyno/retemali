'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getAttendanceOverview } from '../api/attendance.api';
import type { AdminAttendanceEvent } from '../types/attendance.types';

export interface UseAdminAttendanceResult {
  events: AdminAttendanceEvent[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useAdminAttendance(eventId?: string): UseAdminAttendanceResult {
  const [events, setEvents] = useState<AdminAttendanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAttendanceOverview(eventId);
      if (requestId !== requestIdRef.current) return;
      setEvents(response.data?.events ?? []);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setEvents([]);
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : 'Gagal memuat data absensi.'
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { events, loading, error, reload: load };
}
