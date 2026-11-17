import { QrCode } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { MyTicket } from '../types/member.types';

interface TicketItemProps {
  ticket: MyTicket;
}

export function TicketItem({ ticket }: TicketItemProps) {
  return (
    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
      <div className="space-y-0.5">
        <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
          {ticket.ticketCode}
        </span>
        <h4 className="text-xs font-bold text-slate-900">{ticket.event?.title}</h4>
        <p className="text-[11px] text-slate-600">
          {ticket.event?.eventDate ? formatDate(ticket.event.eventDate) : 'Sabtu'} •{' '}
          {ticket.event?.startTime} - {ticket.event?.endTime} WIB
        </p>
      </div>

      <div className="w-9 h-9 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
        <QrCode size={20} />
      </div>
    </div>
  );
}
