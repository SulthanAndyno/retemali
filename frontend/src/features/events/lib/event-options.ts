import type { EventCategory, EventFeeType, EventItem } from '../types/event.types';

export const EVENT_CATEGORIES: readonly { value: 'ALL' | EventCategory; label: string }[] = [
  { value: 'ALL', label: 'Semua Acara' },
  { value: 'DONGENG', label: 'Festival Dongeng' },
  { value: 'ANAK', label: 'Kelas Anak' },
  { value: 'SAINS', label: 'Sains Kreatif' },
  { value: 'KLUB_BUKU', label: 'Klub Buku Warga' },
  { value: 'UMUM', label: 'Umum' },
];

export const EVENT_CATEGORY_OPTIONS: readonly { value: EventCategory; label: string }[] = [
  { value: 'DONGENG', label: 'Festival Dongeng' },
  { value: 'ANAK', label: 'Kelas Anak' },
  { value: 'SAINS', label: 'Sains Kreatif' },
  { value: 'KLUB_BUKU', label: 'Klub Buku Warga' },
  { value: 'MENULIS', label: 'Kelas Menulis' },
  { value: 'UMUM', label: 'Umum' },
];

export const EVENT_FEE_LABELS: Record<EventFeeType, string> = {
  FREE: 'Gratis',
  INFAQ: 'Infaq Sukarela',
};

export const DEFAULT_EVENT_LOCATION = 'Saung Baca Rete Mali, Jatirangga';
export const DEFAULT_EVENT_FACILITATOR = 'Tim Literasi Rete Mali';
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export function isPaidEvent(event: Pick<EventItem, 'feeType' | 'infaqAmount'>): boolean {
  return event.feeType === 'INFAQ' && Number(event.infaqAmount ?? 0) > 0;
}
