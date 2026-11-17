import { ArrowDownRight } from 'lucide-react';
import { formatDateId, formatNumber, formatRupiah } from '../lib/report-format';
import type { CashEntry } from '../types/report.types';
import { CashCategoryIcon } from './cash-category-icon';

interface CashLedgerListProps {
  entries: CashEntry[];
  loading: boolean;
}

export function CashLedgerList({ entries, loading }: CashLedgerListProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Rincian Transaksi</h2>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {formatNumber(entries.length)}
        </span>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-[11px] text-slate-400 text-center py-4">
          Tidak ada transaksi pada periode ini.
        </p>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <CashCategoryIcon category={entry.category} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-800 line-clamp-2">
                {entry.label}
              </p>
              <p className="text-[9px] text-slate-500">
                {formatDateId(entry.date)} • {entry.method} • {entry.reference}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5 justify-end">
                <ArrowDownRight size={11} />
                {formatRupiah(entry.amount)}
              </p>
              <p className="text-[9px] text-slate-400">{entry.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
