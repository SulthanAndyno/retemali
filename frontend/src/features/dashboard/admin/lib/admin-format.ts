import type {
  OverdueCirculationAlert,
  ShiftType,
  SystemAuditLog,
} from '../types/admin.types';

const DAY_IN_MS = 86_400_000;

const SHIFT_TYPE_LABELS: Record<ShiftType, string> = {
  SHIFT_PAGI: 'Shift Pagi',
  SHIFT_SIANG: 'Shift Siang',
  SHIFT_SORE: 'Shift Sore',
  SHIFT_MALAM: 'Shift Malam',
};

const AUDIT_COLORS: Record<string, string> = {
  AUTH: '#3b82f6',
  BOOK: '#6366f1',
  CIRCULATION: '#ef4444',
  DONATION: '#f59e0b',
  EVENT: '#10b981',
  VOLUNTEER: '#8b5cf6',
};

export interface OverdueLoanView {
  id: string;
  bookTitle: string;
  bookCover: string | null;
  borrowerName: string;
  phone: string | null;
  overdueDays: number;
  dueDate: string;
}

export interface AuditLogView {
  id: string;
  color: string;
  title: string;
  timeAgo: string;
  description: string;
}

export function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || '?';
}

export function getDonationTargetPercentage(collected: number, target: number): number {
  if (!Number.isFinite(collected) || !Number.isFinite(target) || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((collected / target) * 100)));
}

export function formatShiftDuration(durationHours: string | number | null): string {
  const duration = Number(durationHours ?? 0);
  return Number.isFinite(duration) ? duration.toFixed(1) : '0.0';
}

export function formatShiftType(shiftType: ShiftType): string {
  return SHIFT_TYPE_LABELS[shiftType] ?? 'Shift Piket';
}

export function formatShiftClock(iso: string | null): string {
  if (!iso) return '--:--';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:--';

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export function formatOverdueLoan(
  alert: OverdueCirculationAlert,
  now = Date.now()
): OverdueLoanView {
  const dueDate = new Date(alert.dueDate);
  const validDueDate = !Number.isNaN(dueDate.getTime());

  return {
    id: alert.id,
    bookTitle: alert.book?.title || 'Buku tanpa judul',
    bookCover: alert.book?.coverImage ?? null,
    borrowerName: alert.user?.name || 'Anggota',
    phone: alert.user?.phone ?? null,
    overdueDays: validDueDate
      ? Math.max(0, Math.floor((now - dueDate.getTime()) / DAY_IN_MS))
      : 0,
    dueDate: validDueDate
      ? dueDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-',
  };
}

export function formatAuditLog(log: SystemAuditLog, now = Date.now()): AuditLogView {
  return {
    id: log.id,
    color: AUDIT_COLORS[log.category.toUpperCase()] ?? '#6b7280',
    title: log.title,
    timeAgo: formatTimeAgo(log.createdAt, now),
    description: log.description,
  };
}

function formatTimeAgo(createdAt: string, now: number): string {
  const timestamp = new Date(createdAt).getTime();
  if (Number.isNaN(timestamp)) return '-';

  const elapsedSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (elapsedSeconds < 60) return 'Baru saja';

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} hari lalu`;
}
