const DATE_LOCALE = 'id-ID';
const JAKARTA_TIME_ZONE = 'Asia/Jakarta';

export function formatDateId(value: string | Date | null | undefined): string {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: JAKARTA_TIME_ZONE,
  }).format(date);
}

export function formatDateTimeId(value: string | Date | null | undefined): string {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '-';

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: JAKARTA_TIME_ZONE,
  }).format(date);

  return `${formatDateId(date)} • ${time} WIB`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat(DATE_LOCALE, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(DATE_LOCALE).format(Number.isFinite(value) ? value : 0);
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
