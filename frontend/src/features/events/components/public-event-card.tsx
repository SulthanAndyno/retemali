import Link from 'next/link';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { formatDateId } from '@/shared/lib/format';
import type { AutoCloseState, EventItem } from '../types/event.types';
import { isPaidEvent } from '../lib/event-options';

export function PublicEventCard({
  event,
  autoCloseState,
}: {
  event: EventItem;
  autoCloseState?: AutoCloseState | null;
}) {
  const paid = isPaidEvent(event);
  const registered = Boolean(event.isRegistered);
  const phase = autoCloseState?.phase;
  const closed =
    phase === 'ENDED' ||
    phase === 'COMPLETED' ||
    event.status === 'COMPLETED';

  return (
    <Link href={`/kegiatan/${event.id}`}>
      <Card className="h-full space-y-2.5 transition-shadow hover:shadow-drawer">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={paid ? 'warning' : 'success'}>
            {paid ? 'Berbayar' : 'Gratis'}
          </Badge>
          <Badge tone={closed ? 'neutral' : 'info'}>
            {closed ? 'Selesai' : (autoCloseState?.label ?? 'Akan Datang')}
          </Badge>
          {registered ? <Badge tone="info">Sudah Terdaftar</Badge> : null}
        </div>

        <h3 className="font-bold leading-snug text-ink">{event.title}</h3>

        <dl className="space-y-1.5 text-sm text-ink-soft">
          <div className="flex items-start gap-1.5">
            <CalendarDays
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
              aria-hidden
            />
            <span>
              {formatDateId(event.eventDate)} • {event.startTime} WIB
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
              aria-hidden
            />
            <span>Selesai {event.endTime} WIB</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
              aria-hidden
            />
            <span className="min-w-0">{event.location}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Users
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
              aria-hidden
            />
            <span>
              Sisa {Math.max(0, event.quota - event.registeredCount)} dari{' '}
              {event.quota} kuota
            </span>
          </div>
        </dl>

        <span className="inline-flex text-sm font-semibold text-primary-deep underline-offset-4 hover:underline">
          Lihat Detail Kegiatan
        </span>
      </Card>
    </Link>
  );
}
