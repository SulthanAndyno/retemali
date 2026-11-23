import { ApiError, del, get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type {
  AutoCloseState,
  EventFormValues,
  EventItem,
  EventRegistrationRecord,
  EventTicket,
} from '../types/event.types';

export function getEvents(limit = 100) {
  return get<ApiEnvelope<EventItem[]>>(`/events?limit=${limit}`);
}

export function getEventById(identifier: string) {
  return get<ApiEnvelope<EventItem>>(`/events/${encodeURIComponent(identifier)}`);
}

export function getMyTickets() {
  return get<ApiEnvelope<EventTicket[]>>('/events/tickets/me');
}

export async function getAutoCloseStates() {
  const response = await fetch('/api/events/auto-close', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  const payload = (await response.json().catch(() => null)) as
    | { data?: { events?: AutoCloseState[] }; message?: string }
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? 'Gagal mengevaluasi status kegiatan.',
      response.status,
      payload
    );
  }

  return payload?.data?.events ?? [];
}

export function registerEvent(id: string, proof?: File | null) {
  if (!proof) {
    return post<ApiEnvelope<EventRegistrationRecord>>(`/events/${id}/register`);
  }

  const body = new FormData();
  body.append('paymentProof', proof);
  return post<ApiEnvelope<EventRegistrationRecord>>(
    `/events/${id}/register`,
    body
  );
}

/** Kredensial E-Tiket tunggal berdasarkan kode tiket. */
export function getTicketCredential(ticketCode: string) {
  return get<ApiEnvelope<EventRegistrationRecord>>(
    `/events/tickets/${encodeURIComponent(ticketCode)}`
  );
}

function buildEventFormData(values: EventFormValues, bannerFile: File | null) {
  const body = new FormData();
  body.append('title', values.title.trim());
  body.append('category', values.category);
  body.append('description', values.description.trim());
  body.append('facilitatorName', values.facilitatorName.trim() || 'Tim Literasi Rete Mali');
  body.append('location', values.location.trim() || 'Saung Baca Rete Mali, Jatirangga');
  body.append('eventDate', new Date(values.eventDate).toISOString());
  body.append('startTime', values.startTime);
  body.append('endTime', values.endTime);
  body.append('quota', String(values.quota));
  body.append('feeType', values.feeType);
  body.append(
    'ticketPrice',
    String(values.feeType === 'PAID' ? values.ticketPrice : 0)
  );
  body.append('registrationCloseOffsetDays', String(values.registrationCloseOffsetDays));
  if (bannerFile) body.append('bannerImage', bannerFile);
  return body;
}

export function createEvent(values: EventFormValues, bannerFile: File | null) {
  return post<ApiEnvelope<EventItem>>('/events', buildEventFormData(values, bannerFile));
}

export function updateEvent(
  id: string,
  values: EventFormValues,
  bannerFile: File | null
) {
  return patch<ApiEnvelope<EventItem>>(
    `/events/${id}`,
    buildEventFormData(values, bannerFile)
  );
}

export function deleteEvent(id: string) {
  return del<ApiEnvelope<unknown>>(`/events/${id}`);
}
