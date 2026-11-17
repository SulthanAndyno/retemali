'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ReportToastState = { message: string; type: 'success' | 'error' } | null;

export interface UseReportToastResult {
  toast: ReportToastState;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function useReportToast(): UseReportToastResult {
  const [toast, setToast] = useState<ReportToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, type });
      timerRef.current = setTimeout(() => setToast(null), 3500);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast };
}
