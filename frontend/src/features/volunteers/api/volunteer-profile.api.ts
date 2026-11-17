import { patch } from '@/lib/api';
import type { SafeUser } from '@/features/auth';
import type { ApiEnvelope } from '@/shared/types/api';

export interface UpdateVolunteerProfileInput {
  name: string;
  phone: string;
}

export function updateVolunteerProfile(input: UpdateVolunteerProfileInput) {
  return patch<ApiEnvelope<SafeUser>>('/auth/me', input);
}
