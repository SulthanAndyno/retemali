import { get, patch } from '@/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type { AdminBookDonation } from '../types/admin-donations.types';

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
