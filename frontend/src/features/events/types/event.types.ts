import type { EventPhase } from '@/shared/lib/event-timeline';

export type EventCategory = 'ANAK' | 'SAINS' | 'KLUB_BUKU' | 'MENULIS' | 'DONGENG' | 'UMUM';

/** FREE = tanpa tiket masuk, PAID = Pembayaran Tiket Masuk. */
export type EventFeeType = 'FREE' | 'PAID';

/** Offset penutupan pendaftaran: H-3, H-2, atau H-1 sebelum pelaksanaan. */
export type EventCloseOffsetDays = 1 | 2 | 3;

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
  /** Harga tiket masuk dalam rupiah; 0 berarti gratis. */
  ticketPrice: string | number;
  /** Berapa hari sebelum pelaksanaan pendaftaran ditutup otomatis. */
  registrationCloseOffsetDays?: number;
  /** Batas pendaftaran yang dihitung server (ISO +07:00). */
  registrationCloseAt?: string | null;
  closeRule?: string | null;
  isRegistrationOpen?: boolean;
  isAutoClosed?: boolean;
  closedReason?: string | null;
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
  closeRule?: string | null;
  registrationCloseAtWib?: string | null;
  closeOffsetDays?: number;
}

export interface EventTicket {
  id: string;
  eventId: string;
  ticketCode: string;
  status: string;
  paymentStatus: string | null;
}

/**
 * Kredensial E-Tiket + bukti pembayaran yang dikirim server pada setiap
 * registrasi, daftar tiket saya, dan check-in.
 */
export interface TicketCredential {
  ticketCode: string;
  credentialStatus:
    | 'ACTIVE_VALID'
    | 'PENDING_PAYMENT_VERIFICATION'
    | 'USED_CHECKED_IN'
    | 'INVALID_OR_REJECTED';
  isPaymentRequired: boolean;
  ticketPrice: number;
  hasPaymentProof: boolean;
  paymentProofUrl: string | null;
  paymentStatus: string;
  /** "LUNAS / TERVERIFIKASI", "MENUNGGU VERIFIKASI", "GRATIS — TERVERIFIKASI", ... */
  paymentStatusLabel: string;
  paymentNote: string | null;
  verifiedAt: string | null;
  verifiedAtWib: string | null;
  issuedAtWib: string;
  checkedInAtWib: string | null;
  participantName: string | null;
  participantCode: string | null;
  eventTitle: string | null;
  eventScheduleWib: string | null;
  eventLocation: string | null;
  eventDateWib: string | null;
}

export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  userId: string;
  ticketCode: string;
  status: string;
  paymentStatus: string | null;
  paymentProofUrl?: string | null;
  createdAt?: string;
  ticketCredential: TicketCredential;
  event?: EventItem;
  user?: {
    id: string;
    name: string;
    email?: string;
    memberCode: string;
  };
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
  ticketPrice: number;
  registrationCloseOffsetDays: EventCloseOffsetDays;
}

export interface EventActionResult {
  ok: boolean;
  message: string;
}
