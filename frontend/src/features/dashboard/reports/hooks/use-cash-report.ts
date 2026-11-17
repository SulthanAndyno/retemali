'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getCashReport } from '../api/reports.api';
import type { CashFilters, CashReport, ReportError } from '../types/report.types';

export interface UseCashReportResult {
  report: CashReport | null;
  loading: boolean;
  error: ReportError | null;
  reload: () => Promise<void>;
}

function toError(error: unknown): ReportError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: 'Gagal memuat laporan kas.', status: 0 };
}

export function useCashReport(filters: CashFilters): UseCashReportResult {
  const [report, setReport] = useState<CashReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReportError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getCashReport(filters);
      if (requestId !== requestIdRef.current) return;
      setReport(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(toError(loadError));
      setReport(null);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { report, loading, error, reload: load };
}
