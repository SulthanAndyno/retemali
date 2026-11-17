import { CalendarDays, CheckCircle2, UserX, Users } from 'lucide-react';
import { formatNumber } from '../lib/report-format';
import type { AttendanceTotals } from '../types/report.types';

interface AttendanceKpiGridProps {
  totals: AttendanceTotals | undefined;
  loading: boolean;
}

export function AttendanceKpiGrid({ totals, loading }: AttendanceKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="bg-white rounded-2xl p-3 border border-blue-50 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <CalendarDays size={18} />
        </div>
        <div>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            {loading ? '—' : formatNumber(totals?.events ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 leading-tight">Kegiatan</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-3 border border-blue-50 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Users size={18} />
        </div>
        <div>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            {loading ? '—' : formatNumber(totals?.registered ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 leading-tight">Pendaftar</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-3 border border-blue-50 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            {loading ? '—' : formatNumber(totals?.checkedIn ?? 0)}
          </p>
          <p className="text-[11px] text-slate-500 leading-tight">Hadir</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-3 border border-blue-50 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <UserX size={18} />
        </div>
        <div>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            {loading ? '—' : `${totals?.attendanceRate ?? 0}%`}
          </p>
          <p className="text-[11px] text-slate-500 leading-tight">Tingkat kehadiran</p>
        </div>
      </div>
    </div>
  );
}
