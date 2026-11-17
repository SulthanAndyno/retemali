import { CalendarDays, RefreshCw } from 'lucide-react';
import type { EventOption } from '../types/report.types';
import { ReportDateRange } from './report-date-range';
import { ReportExportButton } from './report-export-button';

interface AttendanceFilterCardProps {
  from: string;
  to: string;
  eventId: string;
  eventOptions: EventOption[];
  loading: boolean;
  exporting: boolean;
  canExport: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onEventChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function AttendanceFilterCard({
  from,
  to,
  eventId,
  eventOptions,
  loading,
  exporting,
  canExport,
  onFromChange,
  onToChange,
  onEventChange,
  onApply,
  onReset,
  onExport,
}: AttendanceFilterCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays size={16} className="text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">Periode Laporan</h2>
      </div>

      <ReportDateRange
        from={from}
        to={to}
        onFromChange={onFromChange}
        onToChange={onToChange}
      />

      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
          Kegiatan tertentu (opsional)
        </label>
        <select
          value={eventId}
          onChange={(event) => onEventChange(event.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua kegiatan</option>
          {eventOptions.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onApply}
          disabled={loading}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Memuat...' : 'Tampilkan'}
        </button>
        <button
          onClick={onReset}
          className="px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      <ReportExportButton
        exporting={exporting}
        disabled={exporting || loading || !canExport}
        onClick={onExport}
      />
      <p className="text-[10px] text-slate-500 text-center leading-snug">
        Berkas .xlsx berisi 3 sheet: Info Laporan, Ringkasan Event, dan Presensi Peserta.
      </p>
    </section>
  );
}
