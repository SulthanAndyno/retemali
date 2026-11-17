import type { PaginatedMeta } from '@/shared/types/api';
import type { BorrowingRow } from '../types/circulation.types';
import { BorrowingsEmptyState } from './borrowings-empty-state';
import { BorrowingsPagination } from './borrowings-pagination';
import { BorrowingsSkeleton } from './borrowings-skeleton';
import { BorrowingsTable } from './borrowings-table';

interface BorrowingsTableCardProps {
  loading: boolean;
  rows: BorrowingRow[];
  meta: PaginatedMeta | undefined;
  page: number;
  hasError: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function BorrowingsTableCard({
  loading,
  rows,
  meta,
  page,
  hasError,
  onPrev,
  onNext,
}: BorrowingsTableCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-900">Riwayat Peminjaman</h2>
        <span className="text-[10px] text-slate-500">
          Hal. {meta?.page ?? page} / {Math.max(1, meta?.totalPages ?? 1)}
        </span>
      </div>

      {loading && rows.length === 0 && <BorrowingsSkeleton />}

      {!loading && rows.length === 0 && !hasError && <BorrowingsEmptyState />}

      {rows.length > 0 && <BorrowingsTable rows={rows} />}

      {meta && (
        <BorrowingsPagination
          meta={meta}
          loading={loading}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </section>
  );
}
