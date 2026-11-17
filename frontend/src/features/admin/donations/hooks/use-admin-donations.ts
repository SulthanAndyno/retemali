'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  getBookDonations,
  verifyBookDonation,
} from '../api/admin-donations.api';
import type { AdminBookDonation } from '../types/admin-donations.types';

export interface UseAdminDonationsResult {
  donations: AdminBookDonation[];
  loading: boolean;
  error: string | null;
  verifyingId: string | null;
  reload: () => Promise<void>;
  verify: (id: string, status: 'ACCEPTED' | 'REJECTED') => Promise<string>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Gagal memuat donasi buku.';
}

export function useAdminDonations(): UseAdminDonationsResult {
  const [donations, setDonations] = useState<AdminBookDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookDonations();
      setDonations(response.data ?? []);
    } catch (loadError) {
      setError(errorMessage(loadError));
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const verify = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    setVerifyingId(id);
    try {
      await verifyBookDonation(id, status);
      await load();
      return status === 'ACCEPTED'
        ? 'Donasi buku diterima.'
        : 'Donasi buku ditolak.';
    } catch (verifyError) {
      return errorMessage(verifyError);
    } finally {
      setVerifyingId(null);
    }
  };

  return { donations, loading, error, verifyingId, reload: load, verify };
}
