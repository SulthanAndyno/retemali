export {
  formatDateId,
  formatDateTimeId,
  formatNumber,
  formatRupiah,
  toNumber,
} from '@/shared/lib/format';

export function parsePercent(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace('%', '').trim());
    return Number.isFinite(parsed) ? Math.round(parsed) : 0;
  }
  return 0;
}

export function attendancePercent(checkedIn: number, registered: number): number {
  if (registered <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((checkedIn / registered) * 100)));
}
