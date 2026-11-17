'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getVolunteerDashboard } from '../api/volunteer.api';
import type { VolunteerDashboard } from '../types/volunteer.types';

export interface DashboardError {
  message: string;
  /** HTTP status; 0 untuk error jaringan/unknown. */
  status: number;
}

export interface UseVolunteerDashboardResult {
  data: VolunteerDashboard | null;
  loading: boolean;
  error: DashboardError | null;
  /** Muat ulang dengan spinner (tombol "Coba Lagi"). */
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

export function useVolunteerDashboard(): UseVolunteerDashboardResult {
  const [data, setData] = useState<VolunteerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (showSpinner: boolean) => {
    const requestId = ++requestIdRef.current;

    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const response = await getVolunteerDashboard();
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
