import { get } from '@/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  AdminEventOption,
  AdminRegistrationRow,
} from '../types/registrations.types';

interface RegistrationQuery {
  page: number;
  paymentStatus: string;
  eventId: string;
}

export function getAdminRegistrations({ page, paymentStatus, eventId }: RegistrationQuery) {
  const query = new URLSearchParams({ page: String(page), limit: '20' });
  if (paymentStatus) query.set('paymentStatus', paymentStatus);
  if (eventId) query.set('eventId', eventId);

  return get<ApiEnvelope<AdminRegistrationRow[]> & { meta: PaginatedMeta }>(
    `/events/registrations?${query.toString()}`
  );
}

export async function getAdminEventOptions(): Promise<AdminEventOption[]> {
  const response = await get<ApiEnvelope<Array<{ id: string; title: string }>>>(
    '/events?limit=100'
  );
  return (response.data ?? []).map((event) => ({ id: event.id, title: event.title }));
}
