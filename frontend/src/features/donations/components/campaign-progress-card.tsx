import { formatCurrency } from '@/shared/lib/utils';

interface CampaignProgressCardProps {
  campaignTitle: string;
  targetAmount: number;
  collectedAmount: number;
  percentage: number;
  loading: boolean;
}

export function CampaignProgressCard({
  campaignTitle,
  targetAmount,
  collectedAmount,
  percentage,
  loading,
}: CampaignProgressCardProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/70 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
          {loading ? 'Memuat Kampanye' : campaignTitle}
        </span>
        <span className="text-xs font-extrabold text-blue-700">
          {percentage}% Target Rak
        </span>
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
          Donasi Buku &amp; Dana Operasional
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Salurkan buku layak baca anak atau infak kas baca melalui QRIS terverifikasi.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-2.5 bg-slate-100 rounded-full" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
      ) : (
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>
              Terkumpul:{' '}
              <strong className="text-slate-800">{formatCurrency(collectedAmount)}</strong>
            </span>
            <span>
              Target: <strong>{formatCurrency(targetAmount)}</strong>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
