'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { BorrowingStatusFilter } from '../types/circulation.types';
import { useBorrowingsLog } from '../hooks/use-borrowings-log';
import { BorrowingsSummaryCard } from '../components/borrowings-summary-card';
import { BorrowingsFilters } from '../components/borrowings-filters';
import { BorrowingsError } from '../components/borrowings-error';
import { BorrowingsTableCard } from '../components/borrowings-table-card';

interface AdminBorrowingsPageProps {
  initialStatus?: BorrowingStatusFilter;
  initialSearch?: string;
  initialPage?: number;
}

export function AdminBorrowingsPage({
  initialStatus = 'ALL',
  initialSearch = '',
  initialPage = 1,
}: AdminBorrowingsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const log = useBorrowingsLog({ initialStatus, initialSearch, initialPage });
  const rows = log.data?.rows ?? [];
  const meta = log.data?.meta;

  useEffect(() => {
    const params = new URLSearchParams();
    if (log.status !== 'ALL') params.set('status', log.status);
    if (log.searchInput) params.set('q', log.searchInput);
    if (log.page > 1) params.set('hal', String(log.page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [log.status, log.searchInput, log.page, pathname, router]);

  return (
    <div className="space-y-4">
      <BorrowingsSummaryCard
        total={meta?.total ?? 0}
        summary={log.data?.pageSummary ?? null}
        loading={log.loading}
        onRefresh={() => void log.refresh()}
      />
      <BorrowingsFilters
        searchInput={log.searchInput}
        status={log.status}
        onSearchChange={log.setSearchInput}
        onStatusChange={log.selectStatus}
      />
      {log.error ? (
        <BorrowingsError
          message={log.error.message}
          onRetry={() => void log.refresh()}
        />
      ) : null}
      <BorrowingsTableCard
        loading={log.loading}
        rows={rows}
        meta={meta}
        page={log.page}
        hasError={Boolean(log.error)}
        onPrev={() => log.setPage(Math.max(1, log.page - 1))}
        onNext={() => log.setPage(log.page + 1)}
      />
    </div>
  );
}
