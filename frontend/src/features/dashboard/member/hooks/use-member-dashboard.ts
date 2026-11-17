'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getMemberDashboard } from '../api/member.api';
import type { MemberDashboard } from '../types/member.types';

export interface DashboardError {
  message: string;
  /** HTTP status; 0 untuk error jaringan/unknown. */
  status: number;
}

export interface UseMemberDashboardResult {
  data: MemberDashboard | null;
  loading: boolean;
  error: DashboardError | null;
  /** Muat ulang dengan spinner (dipakai tombol "Coba Lagi"). */
  reload: () => Promise<void>;
  /** Muat ulang tanpa spinner (setelah mutasi). */
  refresh: () => Promise<void>;
}

function toDashboardError(error: unknown): DashboardError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: 'Gagal memuat data. Coba lagi.', status: 0 };
}

export function useMemberDashboard(): UseMemberDashboardResult {
  const [data, setData] = useState<MemberDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (showSpinner: boolean) => {
    const requestId = ++requestIdRef.current;

    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const response = await getMemberDashboard();
      if (requestId !== requestIdRef.current) return;
      setData(response.data);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(toDashboardError(err));
    } finally {
      if (requestId === requestIdRef.current && showSpinner) {
        setLoading(false);
      }
    }
  }, []);

  const reload = useCallback(() => load(true), [load]);
  const refresh = useCallback(() => load(false), [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(true);
  }, [load]);

  return { data, loading, error, reload, refresh };
}
