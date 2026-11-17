import { getBookCategoryLabel } from './book-category';
import type { FeaturedEvent } from '../types/home.types';

const DAY_IN_MS = 86_400_000;

export function formatStatCount(value: number): string {
  return `${Number(value || 0).toLocaleString('id-ID')}+`;
}

export function formatEventSchedule(event: FeaturedEvent): string {
  const date = new Date(event.eventDate);
  const day = Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

  return `${day} • ${event.startTime} - ${event.endTime} WIB`;
}

export function isWithinDays(iso: string, days: number, now = Date.now()): boolean {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return false;
  return Math.abs(timestamp - now) <= days * DAY_IN_MS;
}

export function getEventSeatsLabel(event: FeaturedEvent): string {
  const seatsLeft = Math.max(0, event.quota - event.registeredCount);
  if (seatsLeft === 0) return 'Kuota Penuh';
  return `Sisa ${seatsLeft} Kursi`;
}

export function getBookStatusLabel(status: string): string {
  if (status === 'AVAILABLE') return 'Tersedia';
  if (status === 'MAINTENANCE') return 'Perawatan';
  return 'Dipinjam';
}

export function getBookCategoryName(category: string): string {
  return getBookCategoryLabel(category);
}
