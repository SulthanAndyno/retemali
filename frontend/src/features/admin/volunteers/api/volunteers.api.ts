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

export interface RoleChangeResult {
  user: {
    id: string;
    name: string;
    email: string;
    memberCode: string;
    role: 'MEMBER' | 'VOLUNTEER' | 'ADMIN';
  };
  previousRole: string;
  changed: boolean;
  note: string;
}

/** Menurunkan peran relawan menjadi anggota biasa (Admin only). */
export function changeVolunteerRole(userId: string, role: 'MEMBER' = 'MEMBER') {
  return patch<ApiEnvelope<RoleChangeResult>>(`/volunteers/${userId}/role`, {
    role,
  });
}
