'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  getAttendanceSnapshot,
  getAuditLogSnapshot,
  getBookCount,
  getBookDonationSnapshot,
  getEventSnapshot,
  getRegistrationSnapshot,
  getVolunteerApplicationSnapshot,
} from '../api/admin.api';
import {
  buildAdminOverview,
  EMPTY_ADMIN_OVERVIEW,
  type AdminOverviewData,
} from '../lib/admin-overview';

export interface UseAdminOverviewResult {
  data: AdminOverviewData;
  loading: boolean;
  failedSources: string[];
  authStatus: 401 | 403 | null;
  reload: () => Promise<void>;
}

export function useAdminOverview(): UseAdminOverviewResult {
  const [data, setData] = useState<AdminOverviewData>(EMPTY_ADMIN_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<401 | 403 | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setAuthStatus(null);

    const [
      books,
      events,
      pendingPayments,
      registrations,
      bookDonations,
      applications,
      audit,
      attendance,
    ] = await Promise.allSettled([
      getBookCount(),
      getEventSnapshot(),
      getRegistrationSnapshot({ limit: 5, paymentStatus: 'PENDING' }),
      getRegistrationSnapshot({ limit: 1 }),
      getBookDonationSnapshot(),
      getVolunteerApplicationSnapshot(),
      getAuditLogSnapshot(6),
      getAttendanceSnapshot(),
    ]);

    if (requestId !== requestIdRef.current) return;

    const results = {
      books,
      events,
      pendingPayments,
      registrations,
      bookDonations,
      applications,
      audit,
      attendance,
    };

    for (const result of Object.values(results)) {
      if (result.status === 'rejected' && result.reason instanceof ApiError) {
        if (result.reason.status === 401 || result.reason.status === 403) {
          setAuthStatus(result.reason.status);
          break;
        }
      }
    }

    const built = buildAdminOverview(results);
    setData(built.data);
    setFailedSources(built.failedSources);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { data, loading, failedSources, authStatus, reload: load };
}
