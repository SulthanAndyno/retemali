import { Ticket } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils';
import type { MyTicket } from '../types/member.types';
import { TicketCredentialButton } from '@/features/members';

interface TicketItemProps {
  ticket: MyTicket;
}

export function TicketItem({ ticket }: TicketItemProps) {
  return (
    <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
      <div className="flex items-center justify-between">
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
          <Ticket size={20} />
        </div>
      </div>
      <div className="flex justify-end">
        <TicketCredentialButton ticketCode={ticket.ticketCode} />
      </div>
    </div>
  );
}
