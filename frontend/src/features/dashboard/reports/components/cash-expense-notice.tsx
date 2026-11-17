import { Info } from 'lucide-react';
import { formatRupiah } from '../lib/report-format';

interface CashExpenseNoticeProps {
  reason: string | undefined;
  netCashFlow: number | undefined;
}

export function CashExpenseNotice({ reason, netCashFlow }: CashExpenseNoticeProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
      <Info size={15} className="text-amber-700 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-amber-900">Pengeluaran belum tercatat</p>
        <p className="text-[10px] text-amber-800 leading-snug">
          {reason ??
            'Belum ada tabel/field pengeluaran pada basis data, sehingga laporan ini hanya merekam arus kas masuk.'}
        </p>
        <p className="text-[10px] text-amber-800 leading-snug">
          Saldo bersih = arus kas masuk ({formatRupiah(netCashFlow ?? 0)}).
        </p>
      </div>
    </div>
  );
}
