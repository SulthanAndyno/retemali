import type { ReactNode } from 'react';

interface MetricChipProps {
  icon: ReactNode;
  iconClassName: string;
  value: ReactNode;
  label: string;
}

export function MetricChip({ icon, iconClassName, value, label }: MetricChipProps) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-blue-50 shadow-xs flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-base font-extrabold text-slate-900 leading-tight">{value}</p>
        <p className="text-[11px] text-slate-500 leading-tight">{label}</p>
      </div>
    </div>
  );
}
