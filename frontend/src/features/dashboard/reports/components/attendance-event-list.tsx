import type { AttendanceEventRow } from '../types/report.types';
import { AttendanceEventCard } from './attendance-event-card';

interface AttendanceEventListProps {
  loading: boolean;
  events: AttendanceEventRow[];
  expandedEventId: string | null;
  onToggle: (eventId: string) => void;
}

export function AttendanceEventList({
  loading,
  events,
  expandedEventId,
  onToggle,
}: AttendanceEventListProps) {
  return (
    <section className="space-y-3">
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-center space-y-1">
          <p className="text-sm font-semibold text-slate-700">Belum ada kegiatan</p>
          <p className="text-[11px] text-slate-500">
            Tidak ada kegiatan pada periode yang dipilih. Coba ubah rentang tanggal.
          </p>
        </div>
      )}

      {!loading &&
        events.map((event) => (
          <AttendanceEventCard
            key={event.eventId}
            event={event}
            expanded={expandedEventId === event.eventId}
            onToggle={() => onToggle(event.eventId)}
          />
        ))}
    </section>
  );
}
