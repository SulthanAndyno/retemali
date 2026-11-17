'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getMemberLoans } from '../api/member.api';
import type { MemberLoan } from '../types/member-page.types';

export interface UseMemberLoansResult {
  loans: MemberLoan[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat peminjaman.';
}

export function useMemberLoans(): UseMemberLoansResult {
  const [loans, setLoans] = useState<MemberLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getMemberLoans();
      if (requestId !== requestIdRef.current) return;
      setLoans(response.data ?? []);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(loadError));
      setLoans([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { loans, loading, error, reload: load };
}
