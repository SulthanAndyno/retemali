import type {
  EventCategory,
  EventCloseOffsetDays,
  EventFeeType,
  EventItem,
} from '../types/event.types';

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
  PAID: 'Pembayaran Tiket Masuk',
};

/** Pilihan batas penutupan pendaftaran (hari sebelum pelaksanaan). */
export const EVENT_CLOSE_OFFSET_OPTIONS: readonly {
  value: EventCloseOffsetDays;
  label: string;
  description: string;
}[] = [
  { value: 3, label: 'H-3', description: 'Tutup 3 hari sebelum kegiatan' },
  { value: 2, label: 'H-2', description: 'Tutup 2 hari sebelum kegiatan' },
  { value: 1, label: 'H-1', description: 'Tutup 1 hari sebelum kegiatan' },
];

export const DEFAULT_EVENT_LOCATION = 'Saung Baca Rete Mali, Jatirangga';
export const DEFAULT_EVENT_FACILITATOR = 'Tim Literasi Rete Mali';
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Harga tiket masuk (Rp). 0 untuk kegiatan gratis. */
export function getTicketPrice(
  event: Pick<EventItem, 'feeType' | 'ticketPrice'>
): number {
  if (event.feeType !== 'PAID') return 0;
  const price = Number(event.ticketPrice ?? 0);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

export function isPaidEvent(event: Pick<EventItem, 'feeType' | 'ticketPrice'>): boolean {
  return getTicketPrice(event) > 0;
}

/** Label harga tiket untuk kartu & tombol: "Gratis" atau "Tiket Masuk Rp 20.000". */
export function formatTicketPriceLabel(
  event: Pick<EventItem, 'feeType' | 'ticketPrice'>,
  formatCurrency: (value: number) => string
): string {
  const price = getTicketPrice(event);
  return price > 0 ? `Tiket Masuk ${formatCurrency(price)}` : 'Gratis';
}
