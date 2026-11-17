import { get, patch } from '@/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type {
  MemberEvent,
  MemberLoan,
  MemberTicket,
} from '../types/member-page.types';

export function getMemberLoans() {
  return get<ApiEnvelope<MemberLoan[]>>('/circulation/loans/me');
}

export function getMemberTickets() {
  return get<ApiEnvelope<MemberTicket[]>>('/events/tickets/me');
}

export function getPublishedEvents() {
  return get<ApiEnvelope<MemberEvent[]>>(
    '/events?limit=100&status=PUBLISHED'
  );
}

export interface UpdateMemberProfileInput {
  name: string;
  phone: string;
}

export function updateMemberProfile(input: UpdateMemberProfileInput) {
  return patch<ApiEnvelope<unknown>>('/auth/me', input);
}

export interface ChangeMemberPasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function changeMemberPassword(input: ChangeMemberPasswordInput) {
  return patch<ApiEnvelope<unknown>>('/auth/change-password', input);
}
