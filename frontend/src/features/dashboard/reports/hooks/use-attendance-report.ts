'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getAttendanceReport } from '../api/reports.api';
import type {
  AttendanceFilters,
  AttendanceReport,
  ReportError,
} from '../types/report.types';

export interface UseAttendanceReportResult {
  report: AttendanceReport | null;
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
  return { message: 'Gagal memuat laporan presensi.', status: 0 };
}

export function useAttendanceReport(filters: AttendanceFilters): UseAttendanceReportResult {
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReportError | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAttendanceReport(filters);
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
