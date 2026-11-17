'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getAttendanceSnapshot,
  getAuditLogSnapshot,
  getBookCount,
  getBookDonationSnapshot,
  getEventSnapshot,
  getRegistrationSnapshot,
  getVolunteerApplicationSnapshot,
} from '../api/admin.api';
import type {
  AdminAttendanceSnapshot,
  AdminAuditLogSnapshot,
  AdminBookDonationSnapshot,
  AdminEventSnapshot,
  AdminRegistrationSnapshot,
  AdminVolunteerApplicationSnapshot,
} from '../types/admin.types';

export interface AdminOverviewData {
  booksTotal: number;
  events: AdminEventSnapshot[];
  eventsTotal: number;
  upcomingEvents: number;
  registrationsTotal: number;
  pendingPayments: AdminRegistrationSnapshot[];
  pendingPaymentCount: number;
  pendingBookDonations: AdminBookDonationSnapshot[];
  pendingBookDonationCount: number;
  applications: AdminVolunteerApplicationSnapshot[];
  pendingVolunteerCount: number;
  approvedVolunteerCount: number;
  auditLogs: AdminAuditLogSnapshot[];
  attendance: AdminAttendanceSnapshot[];
  attendedTotal: number;
}

export interface UseAdminOverviewResult {
  data: AdminOverviewData;
  loading: boolean;
  failedSources: string[];
  reload: () => Promise<void>;
}

const EMPTY: AdminOverviewData = {
  booksTotal: 0,
  events: [],
  eventsTotal: 0,
  upcomingEvents: 0,
  registrationsTotal: 0,
  pendingPayments: [],
  pendingPaymentCount: 0,
  pendingBookDonations: [],
  pendingBookDonationCount: 0,
  applications: [],
  pendingVolunteerCount: 0,
  approvedVolunteerCount: 0,
  auditLogs: [],
  attendance: [],
  attendedTotal: 0,
};

export function useAdminOverview(): UseAdminOverviewResult {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    const [
      booksResult,
      eventsResult,
      pendingPaymentsResult,
      registrationsResult,
      bookDonationsResult,
      applicationsResult,
      auditResult,
      attendanceResult,
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

    const failed: string[] = [];
    const read = <T,>(
      label: string,
      result: PromiseSettledResult<T>,
      fallback: T
    ): T => {
      if (result.status === 'fulfilled') return result.value;
      failed.push(label);
      return fallback;
    };

    const books = read('buku', booksResult, null);
    const events = read('kegiatan', eventsResult, null);
    const pendingPayments = read('pembayaran', pendingPaymentsResult, null);
    const registrations = read('pendaftaran', registrationsResult, null);
    const bookDonations = read('donasi buku', bookDonationsResult, null);
    const applications = read('relawan', applicationsResult, null);
    const auditLogs = read('audit', auditResult, null);
    const attendance = read('presensi', attendanceResult, null);

    const now = Date.now();
    const eventRows = events?.data ?? [];
    const applicationRows = applications?.data ?? [];
    const attendanceRows = [...(attendance?.data?.events ?? [])]
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 5);

    setData({
      booksTotal: books?.meta?.total ?? 0,
      events: eventRows,
      eventsTotal: events?.meta?.total ?? eventRows.length,
      upcomingEvents: eventRows.filter(
        (event) =>
          event.status === 'PUBLISHED' && new Date(event.eventDate).getTime() > now
      ).length,
      registrationsTotal: registrations?.meta?.total ?? 0,
      pendingPayments: pendingPayments?.data ?? [],
      pendingPaymentCount: pendingPayments?.meta?.total ?? 0,
      pendingBookDonations: bookDonations?.data ?? [],
      pendingBookDonationCount: bookDonations?.meta?.total ?? 0,
      applications: applicationRows,
      pendingVolunteerCount: applicationRows.filter((item) => item.status === 'PENDING')
        .length,
      approvedVolunteerCount: applicationRows.filter((item) => item.status === 'APPROVED')
        .length,
      auditLogs: auditLogs?.data ?? [],
      attendance: attendanceRows,
      attendedTotal: attendanceRows.reduce((sum, event) => sum + event.attendedCount, 0),
    });
    setFailedSources(failed);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { data: data ?? EMPTY, loading, failedSources, reload: load };
}
