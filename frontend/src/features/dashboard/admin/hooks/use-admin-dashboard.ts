'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getAdminDashboard } from '../api/admin.api';
import type { AdminDashboard } from '../types/admin.types';

export interface AdminDashboardError {
  message: string;
  /** HTTP status; 0 untuk error jaringan atau error yang tidak dikenali. */
  status: number;
}

export interface UseAdminDashboardResult {
  data: AdminDashboard | null;
  loading: boolean;
  error: AdminDashboardError | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
}

function toDashboardError(error: unknown): AdminDashboardError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: 'Gagal memuat data dashboard. Coba lagi.', status: 0 };
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AdminDashboardError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (showSpinner: boolean) => {
    const requestId = ++requestIdRef.current;

    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const response = await getAdminDashboard();
      if (requestId !== requestIdRef.current) return;
      setData(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(toDashboardError(loadError));
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
