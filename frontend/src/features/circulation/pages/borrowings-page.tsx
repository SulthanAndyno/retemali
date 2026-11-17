'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useBorrowingsLog } from '../hooks/use-borrowings-log';
import { BorrowingsSummaryCard } from '../components/borrowings-summary-card';
import { BorrowingsFilters } from '../components/borrowings-filters';
import { BorrowingsError } from '../components/borrowings-error';
import { BorrowingsTableCard } from '../components/borrowings-table-card';

export function BorrowingsPage() {
  const router = useRouter();
  const log = useBorrowingsLog();

  useEffect(() => {
    if (log.error?.status === 401) {
      router.replace('/login?next=%2Fdashboard%2Fadmin%2Fborrowings');
    } else if (log.error?.status === 403) {
      router.replace('/portal');
    }
  }, [log.error, router]);

  const rows = log.data?.rows ?? [];
  const meta = log.data?.meta;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/60 pb-16 text-slate-800">
      <Header title="Log Peminjaman" subtitle="Arsip sirkulasi buku" showBack />

      <main className="px-4 pt-4 space-y-4">
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
      </main>
    </div>
  );
}
