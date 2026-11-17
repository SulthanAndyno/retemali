import { ChevronDown, ChevronUp } from 'lucide-react';
import { attendancePercent, formatDateId } from '../lib/report-format';
import { PHASE_CLASSES } from '../lib/ticket-status';
import type { AttendanceEventRow } from '../types/report.types';
import { ParticipantTable } from './participant-table';

interface AttendanceEventCardProps {
  event: AttendanceEventRow;
  expanded: boolean;
  onToggle: () => void;
}

export function AttendanceEventCard({
  event,
  expanded,
  onToggle,
}: AttendanceEventCardProps) {
  const progress = attendancePercent(event.checkedInCount, event.activeRegistered);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100/70 overflow-hidden">
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {event.title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {formatDateId(event.eventDate)} • {event.startTime}-{event.endTime} WIB
            </p>
          </div>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
              PHASE_CLASSES[event.phase] ?? 'bg-slate-100 text-slate-600'
            }`}
          >
            {event.phaseLabel}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold">
            <span className="text-slate-600">
              Hadir {event.checkedInCount} dari {event.activeRegistered} pendaftar
            </span>
            <span className="text-blue-700">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-emerald-50 rounded-lg py-1.5">
            <p className="text-xs font-bold text-emerald-700">{event.checkedInCount}</p>
            <p className="text-[9px] text-emerald-700/80 font-medium">Hadir</p>
          </div>
          <div className="bg-amber-50 rounded-lg py-1.5">
            <p className="text-xs font-bold text-amber-700">{event.noShowCount}</p>
            <p className="text-[9px] text-amber-700/80 font-medium">Tidak hadir</p>
          </div>
          <div className="bg-slate-100 rounded-lg py-1.5">
            <p className="text-xs font-bold text-slate-700">
              {event.activeRegistered}/{event.quota}
            </p>
            <p className="text-[9px] text-slate-500 font-medium">Kuota</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Sembunyikan peserta' : `Lihat ${event.participants.length} peserta`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-3">
          <ParticipantTable
            participants={event.participants}
            cancelledCount={event.cancelledCount}
            quota={event.quota}
          />
        </div>
      )}
    </div>
  );
}
