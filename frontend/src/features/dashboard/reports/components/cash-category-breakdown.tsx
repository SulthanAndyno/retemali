import { CASH_CATEGORY_BAR_CLASSES } from '../lib/cash-categories';
import { formatRupiah } from '../lib/report-format';
import type { CashReport } from '../types/report.types';
import { CashCategoryIcon } from './cash-category-icon';

interface CashCategoryBreakdownProps {
  rows: CashReport['byCategory'];
  loading: boolean;
}

export function CashCategoryBreakdown({ rows, loading }: CashCategoryBreakdownProps) {
  const maxAmount = Math.max(1, ...rows.map((row) => row.amount));

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-4 space-y-3">
      <h2 className="text-sm font-bold text-slate-900">Komposisi Pemasukan</h2>
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map((row) => {
            const width = Math.round((row.amount / maxAmount) * 100);
            return (
              <div key={row.category} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <CashCategoryIcon category={row.category} />
                    {row.label}
                    <span className="text-slate-400 font-normal">({row.count})</span>
                  </span>
                  <span className="font-bold text-slate-900">{formatRupiah(row.amount)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${CASH_CATEGORY_BAR_CLASSES[row.category]}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
