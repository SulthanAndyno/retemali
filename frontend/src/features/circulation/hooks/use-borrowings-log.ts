'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getBorrowings } from '../api/circulation.api';
import type {
  BorrowingsError,
  BorrowingsResponse,
  BorrowingStatusFilter,
} from '../types/circulation.types';

export interface UseBorrowingsLogResult {
  data: BorrowingsResponse | null;
  loading: boolean;
  error: BorrowingsError | null;
  status: BorrowingStatusFilter;
  searchInput: string;
  page: number;
  setSearchInput: (value: string) => void;
  selectStatus: (status: BorrowingStatusFilter) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

function toError(error: unknown): BorrowingsError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: 'Gagal memuat log peminjaman.', status: 0 };
}

interface UseBorrowingsLogOptions {
  initialStatus?: BorrowingStatusFilter;
  initialSearch?: string;
  initialPage?: number;
}

export function useBorrowingsLog(
  options: UseBorrowingsLogOptions = {}
): UseBorrowingsLogResult {
  const [data, setData] = useState<BorrowingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<BorrowingsError | null>(null);
  const [status, setStatus] = useState<BorrowingStatusFilter>(
    options.initialStatus ?? 'ALL'
  );
  const [searchInput, setSearchInput] = useState(options.initialSearch ?? '');
  const [search, setSearch] = useState(options.initialSearch ?? '');
  const [page, setPage] = useState(options.initialPage ?? 1);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const nextSearch = searchInput.trim();
    if (nextSearch === search) return;

    const timer = setTimeout(() => {
      setSearch(nextSearch);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getBorrowings({ page, status, search });
      if (requestId !== requestIdRef.current) return;
      setData(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(toError(loadError));
      setData(null);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const selectStatus = (next: BorrowingStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  return {
    data,
    loading,
    error,
    status,
    searchInput,
    page,
    setSearchInput,
    selectStatus,
    setPage,
    refresh: load,
  };
}
