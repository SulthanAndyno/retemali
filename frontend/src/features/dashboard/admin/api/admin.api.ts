import { del, get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  AdminAttendanceSnapshot,
  AdminAuditLogSnapshot,
  AdminBookDonationSnapshot,
  AdminDashboard,
  AdminEventSnapshot,
  AdminFinancialDonationSnapshot,
  AdminRegistrationSnapshot,
  AdminUserCounts,
  AdminVolunteerApplicationSnapshot,
  EventPaymentRegistration,
  EventPaymentStatus,
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

export function getBookCount() {
  return get<ApiEnvelope<unknown[]> & { meta: PaginatedMeta }>('/books?limit=1');
}

export function getEventSnapshot() {
  return get<ApiEnvelope<AdminEventSnapshot[]> & { meta: PaginatedMeta }>(
    '/events?limit=100'
  );
}

export function getRegistrationSnapshot(
  params: { limit?: number; paymentStatus?: EventPaymentStatus } = {}
) {
  const query = new URLSearchParams({ limit: String(params.limit ?? 5) });
  if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);

  return get<ApiEnvelope<AdminRegistrationSnapshot[]> & { meta: PaginatedMeta }>(
    `/events/registrations?${query.toString()}`
  );
}

export function getBookDonationSnapshot() {
  return get<ApiEnvelope<AdminBookDonationSnapshot[]> & { meta: PaginatedMeta }>(
    '/donations/books?status=PENDING_CURATION&limit=5'
  );
}

export function getVolunteerApplicationSnapshot() {
  return get<ApiEnvelope<AdminVolunteerApplicationSnapshot[]> & { meta: PaginatedMeta }>(
    '/volunteers/applications?limit=20'
  );
}

export function getAuditLogSnapshot(limit = 6) {
  return get<ApiEnvelope<AdminAuditLogSnapshot[]> & { meta: PaginatedMeta }>(
    `/audit-logs?limit=${limit}`
  );
}

export function getAttendanceSnapshot() {
  return get<ApiEnvelope<{ events: AdminAttendanceSnapshot[] }>>('/events/attendance');
}

export function getMemberSnapshot() {
  return get<
    ApiEnvelope<unknown[]> & { meta: PaginatedMeta; counts?: AdminUserCounts }
  >('/auth/users?limit=1');
}

export function getFinancialDonationSnapshot(
  params: { limit?: number; status?: string } = {}
) {
  const query = new URLSearchParams({ limit: String(params.limit ?? 6) });
  if (params.status) query.set('status', params.status);

  return get<
    ApiEnvelope<AdminFinancialDonationSnapshot[]> & { meta: PaginatedMeta }
  >(`/donations/financial?${query.toString()}`);
}
