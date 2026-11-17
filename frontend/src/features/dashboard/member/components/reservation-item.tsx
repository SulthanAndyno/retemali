'use client';

import { formatDate } from '@/lib/utils';
import type { ReadyReservation } from '../types/member.types';

interface ReservationItemProps {
  reservation: ReadyReservation;
  pending: boolean;
  onCancel: (reservationId: string) => void;
}

export function ReservationItem({ reservation, pending, onCancel }: ReservationItemProps) {
  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-start justify-between">
      <div>
        <span className="text-[9px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
          {reservation.reservationCode}
        </span>
        <h4 className="text-xs font-bold text-slate-900 mt-0.5">{reservation.book?.title}</h4>
        <p className="text-[11px] text-slate-600">Ambil di: {reservation.pickupCounter}</p>
        <p className="text-[10px] text-amber-700 font-medium">
          Batas ambil: {formatDate(reservation.expiresAt)}
        </p>
      </div>

      <button
        onClick={() => onCancel(reservation.id)}
        disabled={pending}
        className="text-xs text-rose-600 hover:underline font-semibold disabled:opacity-50"
      >
        Batalkan
      </button>
    </div>
  );
}
