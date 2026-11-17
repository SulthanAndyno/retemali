import type { TicketState } from '../types/report.types';

export const PHASE_CLASSES: Record<string, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-emerald-100 text-emerald-700',
  ENDED: 'bg-slate-200 text-slate-700',
  COMPLETED: 'bg-slate-200 text-slate-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  DRAFT: 'bg-amber-100 text-amber-800',
};

export const TICKET_CLASSES: Record<TicketState, string> = {
  CHECKED_IN: 'bg-emerald-100 text-emerald-700',
  REGISTERED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export const TICKET_LABELS: Record<TicketState, string> = {
  CHECKED_IN: 'Hadir',
  REGISTERED: 'Terdaftar',
  CANCELLED: 'Dibatalkan',
};

export function ticketStatusLabel(status: string): string {
  return TICKET_LABELS[status as TicketState] ?? status;
}
