import { formatCurrency } from '@/shared/lib/utils';
import { DONATION_PRESETS } from '../lib/donation-options';

interface AmountPresetsProps {
  amount: number;
  onSelect: (amount: number) => void;
}

export function AmountPresets({ amount, onSelect }: AmountPresetsProps) {
  return (
    <div>
      <label className="font-bold text-slate-700 block mb-1.5">Pilih Nominal Donasi</label>
      <div className="grid grid-cols-3 gap-2">
        {DONATION_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelect(preset)}
            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
              amount === preset
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {formatCurrency(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}
