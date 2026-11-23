'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  changeVolunteerRole,
  getVolunteerApplications,
  reviewVolunteerApplication,
} from '../api/volunteers.api';
import type { AdminVolunteerApplication } from '../types/volunteers.types';

export interface UseAdminVolunteersResult {
  applications: AdminVolunteerApplication[];
  loading: boolean;
  error: string | null;
  pendingId: string | null;
  reload: () => Promise<void>;
  review: (id: string, status: 'APPROVED' | 'REJECTED', note?: string) => Promise<string>;
  demote: (userId: string, name: string) => Promise<string>;
}

export function useAdminVolunteers(): UseAdminVolunteersResult {
  const [applications, setApplications] = useState<AdminVolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVolunteerApplications();
      setApplications(response.data ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : 'Gagal memuat pendaftaran relawan.'
      );
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const review = async (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    note?: string
  ) => {
    setPendingId(id);
    try {
      await reviewVolunteerApplication(id, status, note);
      await load();
      return status === 'APPROVED'
        ? 'Pendaftaran relawan disetujui.'
        : 'Pendaftaran relawan ditolak.';
    } catch (reviewError) {
      return reviewError instanceof ApiError
        ? reviewError.message
        : 'Gagal memproses pendaftaran relawan.';
    } finally {
      setPendingId(null);
    }
  };

  const demote = async (userId: string, name: string) => {
    setPendingId(userId);
    try {
      const response = await changeVolunteerRole(userId);
      await load();
      return (
        response.data?.note ??
        `Peran ${name} berhasil diubah menjadi Anggota (MEMBER).`
      );
    } catch (demoteError) {
      return demoteError instanceof ApiError
        ? demoteError.message
        : 'Gagal mengubah peran relawan.';
    } finally {
      setPendingId(null);
    }
  };

  return { applications, loading, error, pendingId, reload: load, review, demote };
}
