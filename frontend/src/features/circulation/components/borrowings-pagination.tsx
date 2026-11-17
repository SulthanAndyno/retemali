import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber } from '@/shared/lib/format';
import type { PaginatedMeta } from '@/shared/types/api';

interface BorrowingsPaginationProps {
  meta: PaginatedMeta;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function BorrowingsPagination({
  meta,
  loading,
  onPrev,
  onNext,
}: BorrowingsPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-t border-slate-100">
      <button
        onClick={onPrev}
        disabled={!meta.hasPrevPage || loading}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 disabled:opacity-40"
      >
        <ChevronLeft size={12} /> Sebelumnya
      </button>
      <span className="text-[10px] text-slate-500">{formatNumber(meta.total)} data</span>
      <button
        onClick={onNext}
        disabled={!meta.hasNextPage || loading}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 disabled:opacity-40"
      >
        Berikutnya <ChevronRight size={12} />
      </button>
    </div>
  );
}
