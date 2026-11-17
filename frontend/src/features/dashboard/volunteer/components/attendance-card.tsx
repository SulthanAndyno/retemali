'use client';

import { Camera, QrCode } from 'lucide-react';
import { attendancePercent } from '../lib/volunteer-format';
import type { OngoingEventAttendance } from '../types/volunteer.types';

interface AttendanceCardProps {
  event: OngoingEventAttendance | null;
  showTicketInput: boolean;
  ticketCode: string;
  ticketPending: boolean;
  onOpenTicketInput: () => void;
  onTicketCodeChange: (value: string) => void;
  onTicketSubmit: () => void;
}

export function AttendanceCard({
  event,
  showTicketInput,
  ticketCode,
  ticketPending,
  onOpenTicketInput,
  onTicketCodeChange,
  onTicketSubmit,
}: AttendanceCardProps) {
  if (!event) return null;

  const percent = attendancePercent(event.checkedInCount, event.registeredCount);
  const remaining = Math.max(0, event.registeredCount - event.checkedInCount);

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <QrCode size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Presensi Kegiatan Warga
            </h3>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              {event.title} • {event.startTime} - {event.endTime}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          Sesi Berjalan
        </span>
      </div>

      <div className="space-y-1.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Kehadiran Peserta</span>
          <span className="text-blue-700">
            {event.checkedInCount} / {event.registeredCount} Orang ({percent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <span>ⓘ {remaining} tiket belum check-in di gerbang taman baca</span>
        </p>
      </div>

      {showTicketInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Kode Tiket (RETEMALI-EV-XXXX)"
            value={ticketCode}
            onChange={(e) => onTicketCodeChange(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
          />
          <button
            onClick={onTicketSubmit}
            disabled={ticketPending}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            {ticketPending ? '...' : 'Presensi'}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTicketInput}
            className="flex-1 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Camera size={15} />
            <span>Pindai QR Tiket Peserta</span>
          </button>
          <button
            onClick={onOpenTicketInput}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
          >
            <QrCode size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
