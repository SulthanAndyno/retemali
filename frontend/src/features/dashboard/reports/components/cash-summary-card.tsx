import { formatDateId, formatNumber, formatRupiah } from '../lib/report-format';
import type { CashReport, ReportPeriod } from '../types/report.types';

interface CashSummaryCardProps {
  summary: CashReport['summary'] | undefined;
  period: ReportPeriod;
  loading: boolean;
}

export function CashSummaryCard({ summary, period, loading }: CashSummaryCardProps) {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-700 rounded-2xl p-4 text-white shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
        Total arus kas masuk
      </p>
      <p className="text-2xl font-extrabold mt-1">
        {loading ? '—' : formatRupiah(summary?.totalIncome ?? 0)}
      </p>
      <p className="text-[11px] text-blue-200 mt-0.5">
        {formatDateId(period.from)} – {formatDateId(period.to)} •{' '}
        {formatNumber(summary?.transactionCount ?? 0)} transaksi
      </p>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-white/10 rounded-xl p-2">
          <p className="text-[9px] text-blue-200 font-semibold">Donasi</p>
          <p className="text-[11px] font-bold truncate">
            {formatRupiah(summary?.donationIncome ?? 0)}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-2">
          <p className="text-[9px] text-blue-200 font-semibold">Infaq</p>
          <p className="text-[11px] font-bold truncate">
            {formatRupiah(summary?.eventInfaqIncome ?? 0)}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-2">
          <p className="text-[9px] text-blue-200 font-semibold">Denda</p>
          <p className="text-[11px] font-bold truncate">
            {formatRupiah(summary?.fineIncome ?? 0)}
          </p>
        </div>
      </div>
    </section>
  );
}
