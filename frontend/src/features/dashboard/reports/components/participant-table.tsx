import { Users, XCircle, Ticket } from 'lucide-react';
import { formatDateTimeId } from '../lib/report-format';
import { TICKET_CLASSES, TICKET_LABELS } from '../lib/ticket-status';
import type { AttendanceParticipant } from '../types/report.types';

interface ParticipantTableProps {
  participants: AttendanceParticipant[];
  cancelledCount: number;
  quota: number;
}

export function ParticipantTable({
  participants,
  cancelledCount,
  quota,
}: ParticipantTableProps) {
  return (
    <>
      {participants.length === 0 ? (
        <p className="text-[11px] text-slate-500 text-center py-3">
          Belum ada peserta terdaftar pada kegiatan ini.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wide">
                <th className="py-1.5 pr-2 font-bold">Peserta</th>
                <th className="py-1.5 px-2 font-bold">Tiket</th>
                <th className="py-1.5 px-2 font-bold">Status</th>
                <th className="py-1.5 pl-2 font-bold">Check-in</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.registrationId} className="border-t border-slate-200/70">
                  <td className="py-1.5 pr-2">
                    <p className="font-semibold text-slate-800">{participant.memberName}</p>
                    <p className="text-slate-500 font-mono">{participant.memberCode}</p>
                  </td>
                  <td className="py-1.5 px-2 font-mono text-slate-600">
                    {participant.ticketCode}
                  </td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                        TICKET_CLASSES[participant.status] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {TICKET_LABELS[participant.status] ?? participant.status}
                    </span>
                  </td>
                  <td className="py-1.5 pl-2 text-slate-600 whitespace-nowrap">
                    {participant.checkedInAt
                      ? formatDateTimeId(participant.checkedInAt).split('•')[1]?.trim()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-200/70 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Ticket size={11} /> {participants.length} tiket
        </span>
        <span className="flex items-center gap-1">
          <XCircle size={11} /> {cancelledCount} batal
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} /> kuota {quota}
        </span>
      </div>
    </>
  );
}
