import { TicketItem } from './ticket-item';
import type { MyTicket } from '../types/member.types';

interface TicketListProps {
  tickets: MyTicket[];
}

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-2 text-center">
        Belum mendaftar kegiatan apa pun.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
