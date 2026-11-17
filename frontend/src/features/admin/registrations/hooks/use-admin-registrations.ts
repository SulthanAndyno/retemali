'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  getAdminEventOptions,
  getAdminRegistrations,
} from '../api/registrations.api';
import type {
  AdminEventOption,
  AdminRegistrationRow,
} from '../types/registrations.types';

export interface UseAdminRegistrationsResult {
  rows: AdminRegistrationRow[];
  meta: { total: number; page: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean } | null;
  loading: boolean;
  error: string | null;
  page: number;
  paymentStatus: string;
  eventId: string;
  eventOptions: AdminEventOption[];
  setPaymentStatus: (value: string) => void;
  setEventId: (value: string) => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
}

interface UseAdminRegistrationsOptions {
  initialPage?: number;
  initialPaymentStatus?: string;
  initialEventId?: string;
}

export function useAdminRegistrations(
  options: UseAdminRegistrationsOptions = {}
): UseAdminRegistrationsResult {
  const [rows, setRows] = useState<AdminRegistrationRow[]>([]);
  const [meta, setMeta] = useState<UseAdminRegistrationsResult['meta']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [paymentStatus, setPaymentStatusState] = useState(
    options.initialPaymentStatus ?? ''
  );
  const [eventId, setEventIdState] = useState(options.initialEventId ?? '');
  const [eventOptions, setEventOptions] = useState<AdminEventOption[]>([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    getAdminEventOptions()
      .then(setEventOptions)
      .catch(() => setEventOptions([]));
  }, []);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminRegistrations({ page, paymentStatus, eventId });
      if (requestId !== requestIdRef.current) return;
      setRows(response.data ?? []);
      setMeta(response.meta ?? null);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setRows([]);
      setMeta(null);
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : 'Gagal memuat pendaftaran kegiatan.'
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, paymentStatus, eventId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const setPaymentStatus = (value: string) => {
    setPaymentStatusState(value);
    setPage(1);
  };

  const setEventId = (value: string) => {
    setEventIdState(value);
    setPage(1);
  };

  return {
    rows,
    meta,
    loading,
    error,
    page,
    paymentStatus,
    eventId,
    eventOptions,
    setPaymentStatus,
    setEventId,
    setPage,
    reload: load,
  };
}
