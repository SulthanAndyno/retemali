'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  getMemberLoans,
  getMemberTickets,
  getPublishedEvents,
} from '../api/member.api';
import type {
  MemberEvent,
  MemberLoan,
  MemberTicket,
} from '../types/member-page.types';

export interface MemberHomeData {
  loans: MemberLoan[];
  tickets: MemberTicket[];
  events: MemberEvent[];
}

export interface UseMemberHomeResult {
  data: MemberHomeData;
  loading: boolean;
  failedSources: string[];
  authStatus: 401 | 403 | null;
  reload: () => Promise<void>;
}

const EMPTY_DATA: MemberHomeData = {
  loans: [],
  tickets: [],
  events: [],
};

function authStatusFrom(results: PromiseSettledResult<unknown>[]): 401 | 403 | null {
  for (const result of results) {
    if (
      result.status === 'rejected' &&
      result.reason instanceof ApiError &&
      (result.reason.status === 401 || result.reason.status === 403)
    ) {
      return result.reason.status;
    }
  }
  return null;
}

export function useMemberHome(): UseMemberHomeResult {
  const [data, setData] = useState<MemberHomeData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<401 | 403 | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setAuthStatus(null);

    const results = await Promise.allSettled([
      getMemberLoans(),
      getMemberTickets(),
      getPublishedEvents(),
    ]);

    if (requestId !== requestIdRef.current) return;

    const failed: string[] = [];
    const loans =
      results[0].status === 'fulfilled' ? results[0].value.data : [];
    const tickets =
      results[1].status === 'fulfilled' ? results[1].value.data : [];
    const events =
      results[2].status === 'fulfilled' ? results[2].value.data : [];

    if (results[0].status === 'rejected') failed.push('peminjaman');
    if (results[1].status === 'rejected') failed.push('kegiatan');
    if (results[2].status === 'rejected') failed.push('agenda');

    setData({ loans, tickets, events });
    setFailedSources(failed);
    setAuthStatus(authStatusFrom(results));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { data, loading, failedSources, authStatus, reload: load };
}
