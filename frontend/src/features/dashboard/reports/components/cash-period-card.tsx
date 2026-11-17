import { FileSpreadsheet, RefreshCw, Wallet } from 'lucide-react';
import { CASH_PRESET_LABELS, type CashPreset } from '../lib/report-period';

interface CashPeriodCardProps {
  preset: CashPreset;
  from: string;
  to: string;
  loading: boolean;
  exporting: boolean;
  canExport: boolean;
  onSelectPreset: (preset: CashPreset) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApply: () => void;
  onExport: () => void;
}

export function CashPeriodCard({
  preset,
  from,
  to,
  loading,
  exporting,
  canExport,
  onSelectPreset,
  onFromChange,
  onToChange,
  onApply,
  onExport,
}: CashPeriodCardProps) {
  const presets = Object.keys(CASH_PRESET_LABELS) as CashPreset[];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Wallet size={16} className="text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">Periode Laporan Kas</h2>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {presets.map((option) => (
          <button
            key={option}
            onClick={() => onSelectPreset(option)}
            className={`py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
              preset === option
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {CASH_PRESET_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dari</label>
          <input
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Sampai</label>
          <input
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onApply}
          disabled={loading}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Menghitung...' : 'Generate Laporan'}
        </button>
        <button
          onClick={onExport}
          disabled={exporting || loading || !canExport}
          className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          <FileSpreadsheet size={14} />
          {exporting ? '...' : '.xlsx'}
        </button>
      </div>
    </section>
  );
}
