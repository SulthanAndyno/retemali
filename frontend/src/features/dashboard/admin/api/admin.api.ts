import { del, get, patch, post } from '@/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  AdminDashboard,
  EventPaymentRegistration,
  PaymentAccount,
  ReviewVolunteerApplicationInput,
  VerifyEventPaymentInput,
} from '../types/admin.types';

export function getAdminDashboard() {
  return get<ApiEnvelope<AdminDashboard>>('/dashboard/admin');
}

export function reviewVolunteerApplication(
  id: string,
  input: ReviewVolunteerApplicationInput
) {
  return patch<ApiEnvelope<unknown>>(`/volunteers/applications/${id}/review`, input);
}

export function approveVolunteerShift(id: string) {
  return patch<ApiEnvelope<unknown>>(`/volunteers/shifts/${id}/approve`);
}

export function approveAllVolunteerShifts() {
  return patch<ApiEnvelope<unknown>>('/volunteers/shifts/approve-all');
}

/** Dependency backend: endpoint admin harus mengembalikan kanal aktif dan nonaktif. */
export function getAdminPaymentAccounts() {
  return get<ApiEnvelope<PaymentAccount[]>>('/donations/payment-accounts/admin');
}

/** Dependency backend: endpoint CRUD payment account belum tersedia saat refactor frontend dimulai. */
export function createPaymentAccount(input: FormData) {
  return post<ApiEnvelope<PaymentAccount>>('/donations/payment-accounts', input);
}

/** Dependency backend: endpoint CRUD payment account belum tersedia saat refactor frontend dimulai. */
export function updatePaymentAccount(id: string, input: FormData) {
  return patch<ApiEnvelope<PaymentAccount>>(`/donations/payment-accounts/${id}`, input);
}

/** Dependency backend: endpoint CRUD payment account belum tersedia saat refactor frontend dimulai. */
export function deletePaymentAccount(id: string) {
  return del<ApiEnvelope<unknown>>(`/donations/payment-accounts/${id}`);
}

export function getEventPaymentRegistrations() {
  return get<ApiEnvelope<EventPaymentRegistration[]> & { meta: PaginatedMeta }>(
    '/events/registrations?paidOnly=true'
  );
}

export function verifyEventPayment(id: string, input: VerifyEventPaymentInput) {
  return patch<ApiEnvelope<EventPaymentRegistration>>(
    `/events/registrations/${id}/verify`,
    input
  );
}
