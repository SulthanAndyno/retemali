interface ReportDateRangeProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export function ReportDateRange({
  from,
  to,
  onFromChange,
  onToChange,
}: ReportDateRangeProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
          Dari tanggal
        </label>
        <input
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
          Sampai tanggal
        </label>
        <input
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
