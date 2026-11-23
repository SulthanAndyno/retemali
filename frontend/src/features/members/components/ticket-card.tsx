import { CalendarDays, CircleAlert, Hourglass, MapPin } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import type { MemberTicket } from '../types/member-page.types';
import { TicketCredentialButton } from './ticket-credential-button';

function paymentBadge(ticket: MemberTicket): {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'info';
} {
  if (ticket.paymentStatus === 'VERIFIED') {
    return { label: 'Pembayaran terverifikasi', tone: 'success' };
  }
  if (ticket.paymentStatus === 'FAILED') {
    return { label: 'Pembayaran gagal', tone: 'danger' };
  }
  if (ticket.paymentStatus === 'PENDING') {
    return { label: 'Menunggu verifikasi admin', tone: 'warning' };
  }
  return { label: 'Gratis — terkonfirmasi', tone: 'success' };
}

export function TicketCard({ ticket }: { ticket: MemberTicket }) {
  const payment = paymentBadge(ticket);
  const fee = Number(ticket.event.ticketPrice ?? 0);

  return (
    <Card className="space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-ink">{ticket.event.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <CalendarDays className="h-4 w-4 text-primary-deep" aria-hidden />
            {formatDateId(ticket.event.eventDate)} • {ticket.event.startTime} WIB
          </p>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin className="h-4 w-4 text-primary-deep" aria-hidden />
            {ticket.event.location}
          </p>
        </div>
        <Badge tone={payment.tone}>{payment.label}</Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-soft pt-2 text-xs text-ink-soft">
        <span>
          Nomor tiket:{' '}
          <span className="font-mono font-semibold text-ink">
            {ticket.ticketCode}
          </span>
        </span>
        <span>
          {fee > 0
            ? `Tiket Masuk ${formatRupiah(fee)}`
            : 'Tidak memerlukan pembayaran.'}
        </span>
      </div>
      {ticket.paymentStatus === 'PENDING' ? (
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Hourglass className="h-3.5 w-3.5 text-[#E9A23B]" aria-hidden />
          Bukti pembayaran Anda masih dalam antrean verifikasi admin.
        </p>
      ) : null}
      {ticket.paymentNote ? (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <CircleAlert className="h-3.5 w-3.5" aria-hidden />
          Catatan admin: {ticket.paymentNote}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-soft pt-2">
        <p className="text-[11px] text-ink-soft">
          Bukti pembayaran &amp; kredensial masuk kegiatan.
        </p>
        <TicketCredentialButton ticketCode={ticket.ticketCode} />
      </div>
    </Card>
  );
}
