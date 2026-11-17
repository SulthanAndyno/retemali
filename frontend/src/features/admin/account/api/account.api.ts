import { patch } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function changePassword(input: ChangePasswordInput) {
  return patch<ApiEnvelope<unknown>>('/auth/change-password', input);
}
