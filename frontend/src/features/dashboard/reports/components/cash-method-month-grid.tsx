import { formatRupiah } from '../lib/report-format';
import type { CashReport } from '../types/report.types';

interface CashMethodMonthGridProps {
  byMethod: CashReport['byMethod'];
  byMonth: CashReport['byMonth'];
}

export function CashMethodMonthGrid({ byMethod, byMonth }: CashMethodMonthGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-3 space-y-1.5">
        <p className="text-[11px] font-bold text-slate-900">Per Metode</p>
        {byMethod.length === 0 ? (
          <p className="text-[10px] text-slate-400">Belum ada data</p>
        ) : (
          byMethod.slice(0, 5).map((row) => (
            <div key={row.method} className="flex items-center justify-between text-[10px]">
              <span className="text-slate-600 truncate">{row.method}</span>
              <span className="font-semibold text-slate-800">{formatRupiah(row.amount)}</span>
            </div>
          ))
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-3 space-y-1.5">
        <p className="text-[11px] font-bold text-slate-900">Per Bulan</p>
        {byMonth.length === 0 ? (
          <p className="text-[10px] text-slate-400">Belum ada data</p>
        ) : (
          byMonth.slice(-5).map((row) => (
            <div key={row.month} className="flex items-center justify-between text-[10px]">
              <span className="text-slate-600 truncate">{row.label}</span>
              <span className="font-semibold text-slate-800">{formatRupiah(row.income)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
