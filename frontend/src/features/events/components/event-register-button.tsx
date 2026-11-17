import { CheckCircle2, Ticket } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { EventTimeline, QuotaState } from '../lib/events';
import { isPaidEvent } from '../lib/event-options';
import type { EventItem } from '../types/event.types';

interface EventRegisterButtonProps {
  event: EventItem;
  timeline: EventTimeline;
  quota: QuotaState;
  registering: boolean;
  onRegister: () => void;
}

export function EventRegisterButton({
  event,
  timeline,
  quota,
  registering,
  onRegister,
}: EventRegisterButtonProps) {
  const isClosed = !timeline.isRegistrationOpen;

  return (
    <button
      onClick={onRegister}
      disabled={registering || event.isRegistered || isClosed || quota.isFull}
      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
        event.isRegistered
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : isClosed || quota.isFull
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
      }`}
    >
      {event.isRegistered ? (
        <>
          <CheckCircle2 size={15} />
          <span>Terdaftar (Lihat E-Tiket di Portal)</span>
        </>
      ) : (
        <>
          <Ticket size={15} />
          <span>
            {registering
              ? 'Menerbitkan Tiket...'
              : isClosed
                ? 'Pendaftaran Ditutup'
                : quota.isFull
                  ? 'Kuota Habis'
                  : isPaidEvent(event)
                    ? `Daftar (Infaq ${formatCurrency(Number(event.infaqAmount ?? 0))})`
                    : 'Daftar Sekarang (Gratis)'}
          </span>
        </>
      )}
    </button>
  );
}
