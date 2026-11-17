'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getFinancialReceipt } from '../api/donations.api';
import type { FinancialDonationReceipt } from '../types/donation.types';

export interface UseFinancialReceiptResult {
  receipt: FinancialDonationReceipt | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat kuitansi donasi.';
}

export function useFinancialReceipt(code: string): UseFinancialReceiptResult {
  const [receipt, setReceipt] = useState<FinancialDonationReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!code) {
      setReceipt(null);
      setLoading(false);
      setError('Nomor referensi donasi tidak ditemukan.');
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getFinancialReceipt(code);
      if (requestId !== requestIdRef.current) return;
      setReceipt(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setReceipt(null);
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { receipt, loading, error, reload: load };
}
