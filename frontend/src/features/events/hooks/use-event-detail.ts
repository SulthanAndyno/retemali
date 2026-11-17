'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getEventById } from '../api/events.api';
import type { EventItem } from '../types/event.types';

export interface UseEventDetailResult {
  event: EventItem | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat detail kegiatan.';
}

export function useEventDetail(identifier: string): UseEventDetailResult {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getEventById(identifier);
      if (requestId !== requestIdRef.current) return;
      setEvent(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setEvent(null);
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { event, loading, error, reload: load };
}
