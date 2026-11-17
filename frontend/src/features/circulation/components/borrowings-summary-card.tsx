import { RefreshCw } from 'lucide-react';
import { formatNumber } from '@/shared/lib/format';
import { formatFineCompact } from '../lib/borrowing-format';
import type { BorrowingsPageSummary } from '../types/circulation.types';

interface BorrowingsSummaryCardProps {
  total: number;
  summary: BorrowingsPageSummary | null;
  loading: boolean;
  onRefresh: () => void;
}

export function BorrowingsSummaryCard({
  total,
  summary,
  loading,
  onRefresh,
}: BorrowingsSummaryCardProps) {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Total transaksi tercatat
          </p>
          <p className="text-2xl font-extrabold mt-0.5">
            {loading && !summary ? '—' : formatNumber(total)}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
          aria-label="Muat ulang log"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mt-3">
        <div className="bg-white/10 rounded-lg p-1.5 text-center">
          <p className="text-xs font-bold">{summary?.active ?? 0}</p>
          <p className="text-[8px] text-slate-300">Aktif</p>
        </div>
        <div className="bg-white/10 rounded-lg p-1.5 text-center">
          <p className="text-xs font-bold text-rose-200">{summary?.overdue ?? 0}</p>
          <p className="text-[8px] text-slate-300">Terlambat</p>
        </div>
        <div className="bg-white/10 rounded-lg p-1.5 text-center">
          <p className="text-xs font-bold text-emerald-200">{summary?.returned ?? 0}</p>
          <p className="text-[8px] text-slate-300">Kembali</p>
        </div>
        <div className="bg-white/10 rounded-lg p-1.5 text-center">
          <p className="text-xs font-bold text-amber-200">
            {formatFineCompact(summary?.fines ?? 0)}
          </p>
          <p className="text-[8px] text-slate-300">Denda</p>
        </div>
      </div>
      <p className="text-[9px] text-slate-400 mt-2">
        Ringkasan mengacu pada halaman yang sedang ditampilkan.
      </p>
    </section>
  );
}
