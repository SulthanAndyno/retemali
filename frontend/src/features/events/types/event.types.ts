import type { EventPhase } from '../lib/events';

export type EventCategory = 'ANAK' | 'SAINS' | 'KLUB_BUKU' | 'MENULIS' | 'DONGENG' | 'UMUM';
export type EventFeeType = 'FREE' | 'INFAQ';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  facilitatorName: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  quota: number;
  registeredCount: number;
  feeType: EventFeeType;
  infaqAmount: string | number;
  bannerImage?: string | null;
  isRegistered?: boolean;
  status?: string;
}

export interface AutoCloseState {
  id: string;
  phase: EventPhase;
  label: string;
  isRegistrationOpen: boolean;
  isAutoClosed: boolean;
  closedReason: string | null;
  seatsLeft: number;
  isQuotaFull: boolean;
  quotaPercent: number;
}

export interface EventTicket {
  id: string;
  eventId: string;
  ticketCode: string;
  status: string;
  paymentStatus: string | null;
}

export interface EventFormValues {
  title: string;
  category: EventCategory;
  description: string;
  facilitatorName: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  quota: number;
  feeType: EventFeeType;
  infaqAmount: number;
}

export interface EventActionResult {
  ok: boolean;
  message: string;
}
