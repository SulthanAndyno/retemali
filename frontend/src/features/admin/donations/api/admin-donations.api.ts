import { get, patch } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  AdminBookDonation,
  AdminFinancialDonation,
  FinancialDonationStatus,
} from '../types/admin-donations.types';

export function getBookDonations() {
  return get<ApiEnvelope<AdminBookDonation[]> & { meta: PaginatedMeta }>(
    '/donations/books?limit=20'
  );
}

export function verifyBookDonation(
  id: string,
  status: 'ACCEPTED' | 'REJECTED',
  curationNote?: string
) {
  return patch<ApiEnvelope<AdminBookDonation>>(`/donations/books/${id}/verify`, {
    status,
    curationNote,
  });
}

export function getFinancialDonations(status?: FinancialDonationStatus) {
  const query = new URLSearchParams({ limit: '20' });
  if (status) query.set('status', status);
  return get<ApiEnvelope<AdminFinancialDonation[]> & { meta: PaginatedMeta }>(
    `/donations/financial?${query.toString()}`
  );
}

export function verifyFinancialDonation(
  id: string,
  status: 'VERIFIED' | 'FAILED'
) {
  return patch<ApiEnvelope<AdminFinancialDonation>>(
    `/donations/financial/${id}/verify`,
    { status }
  );
}
