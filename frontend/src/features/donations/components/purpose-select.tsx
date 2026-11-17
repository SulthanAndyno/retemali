import { DONATION_PURPOSES } from '../lib/donation-options';

interface PurposeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PurposeSelect({ value, onChange }: PurposeSelectProps) {
  return (
    <div>
      <label className="font-semibold text-slate-700 block mb-1">Peruntukan Dana</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
      >
        {DONATION_PURPOSES.map((purpose) => (
          <option key={purpose} value={purpose}>
            {purpose}
          </option>
        ))}
      </select>
    </div>
  );
}
