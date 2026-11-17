'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getMemberTickets } from '../api/member.api';
import type { MemberTicket } from '../types/member-page.types';

export interface UseMemberTicketsResult {
  tickets: MemberTicket[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat kegiatan.';
}

export function useMemberTickets(): UseMemberTicketsResult {
  const [tickets, setTickets] = useState<MemberTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getMemberTickets();
      if (requestId !== requestIdRef.current) return;
      setTickets(response.data ?? []);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(loadError));
      setTickets([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { tickets, loading, error, reload: load };
}
