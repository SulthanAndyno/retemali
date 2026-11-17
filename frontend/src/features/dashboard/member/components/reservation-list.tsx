import { ReservationItem } from './reservation-item';
import type { ReadyReservation } from '../types/member.types';

interface ReservationListProps {
  reservations: ReadyReservation[];
  pendingId: string | null;
  onCancel: (reservationId: string) => void;
}

export function ReservationList({ reservations, pendingId, onCancel }: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-2 text-center">Belum ada reservasi aktif.</p>
    );
  }

  return (
    <div className="space-y-2">
      {reservations.map((reservation) => (
        <ReservationItem
          key={reservation.id}
          reservation={reservation}
          pending={pendingId === reservation.id}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}
