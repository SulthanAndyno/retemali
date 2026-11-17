'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { useAuth } from '@/features/auth';
import { getEvents, getMyTickets } from '../api/events.api';
import type { EventItem } from '../types/event.types';

export interface UseEventsResult {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  markRegistered: (eventId: string) => void;
  removeEvent: (eventId: string) => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat kegiatan.';
}

export function useEvents(): UseEventsResult {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const [response, tickets] = await Promise.all([
        getEvents(100),
        user ? getMyTickets().catch(() => null) : Promise.resolve(null),
      ]);
      if (requestId !== requestIdRef.current) return;

      const registeredIds = new Set(
        (tickets?.data ?? []).map((ticket) => ticket.eventId)
      );
      setEvents(
        (response.data ?? []).map((event) => ({
          ...event,
          isRegistered: registeredIds.has(event.id),
        }))
      );
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setEvents([]);
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const markRegistered = (eventId: string) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: true,
              registeredCount: event.registeredCount + 1,
            }
          : event
      )
    );
  };

  const removeEvent = (eventId: string) => {
    setEvents((current) => current.filter((event) => event.id !== eventId));
  };

  return { events, loading, error, reload: load, markRegistered, removeEvent };
}
