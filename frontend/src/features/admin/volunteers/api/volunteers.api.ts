import { get, patch } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type { AdminVolunteerApplication } from '../types/volunteers.types';

export function getVolunteerApplications() {
  return get<ApiEnvelope<AdminVolunteerApplication[]> & { meta: PaginatedMeta }>(
    '/volunteers/applications?limit=50'
  );
}

export function reviewVolunteerApplication(
  id: string,
  status: 'APPROVED' | 'REJECTED',
  rejectionNote?: string
) {
  return patch<ApiEnvelope<AdminVolunteerApplication>>(
    `/volunteers/applications/${id}/review`,
    { status, rejectionNote }
  );
}
