'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getPublicHome } from '../api/home.api';
import type { PublicHome } from '../types/home.types';

export interface HomeError {
  message: string;
  status: number;
}

export interface UsePublicHomeResult {
  data: PublicHome | null;
  loading: boolean;
  error: HomeError | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
}

function toHomeError(error: unknown): HomeError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: 'Gagal memuat beranda. Coba lagi.', status: 0 };
}

export function usePublicHome(): UsePublicHomeResult {
  const [data, setData] = useState<PublicHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HomeError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (showSpinner: boolean) => {
    const requestId = ++requestIdRef.current;

    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const response = await getPublicHome();
      if (requestId !== requestIdRef.current) return;
      setData(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(toHomeError(loadError));
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
