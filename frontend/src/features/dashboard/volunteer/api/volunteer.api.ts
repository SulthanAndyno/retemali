import { get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type {
  ClockInInput,
  ClockOutInput,
  HandoverNoteInput,
  QuickCheckoutInput,
  QuickReturnInput,
  VerifyBookDonationInput,
  VolunteerDashboard,
} from '../types/volunteer.types';

/** Data agregat Meja Operasional Relawan. */
export function getVolunteerDashboard() {
  return get<ApiEnvelope<VolunteerDashboard>>('/dashboard/volunteer');
}

export function clockIn(input: ClockInInput) {
  return post<ApiEnvelope<unknown>>('/volunteers/shifts/clock-in', input);
}

export function clockOut(input: ClockOutInput) {
  return patch<ApiEnvelope<unknown>>('/volunteers/shifts/clock-out', input);
}

export function quickCheckout(input: QuickCheckoutInput) {
  return post<ApiEnvelope<unknown>>('/circulation/quick-checkout', input);
}

export function quickReturn(input: QuickReturnInput) {
  return post<ApiEnvelope<unknown>>('/circulation/quick-return', input);
}

export function checkInTicket(ticketCode: string) {
  return post<ApiEnvelope<unknown>>('/events/check-in', { ticketCode });
}

export function verifyBookDonation(id: string, input: VerifyBookDonationInput) {
  return patch<ApiEnvelope<unknown>>(`/donations/books/${id}/verify`, input);
}

export function saveHandoverNote(input: HandoverNoteInput) {
  return post<ApiEnvelope<unknown>>('/volunteers/handover-notes', input);
}
