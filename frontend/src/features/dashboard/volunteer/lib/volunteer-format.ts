import type { ShiftType } from '../types/volunteer.types';

const SHIFT_LABELS: Record<ShiftType, string> = {
  SHIFT_PAGI: 'Shift Pagi (09:00 – 14:00 WIB)',
  SHIFT_SIANG: 'Shift Siang (14:00 – 18:00 WIB)',
  SHIFT_SORE: 'Shift Sore (18:00 – 21:00 WIB)',
  SHIFT_MALAM: 'Shift Malam (21:00 – 24:00 WIB)',
};

/** Label pill shift; jam mengikuti jadwal visual yang sudah ada. */
export function shiftLabel(shiftType: ShiftType | null | undefined): string {
  if (!shiftType) return 'Belum ada shift aktif';
  return SHIFT_LABELS[shiftType] ?? 'Shift Piket';
}

/** Inisial maksimal 2 huruf dari kata pertama dan kedua. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Detik → `HH : MM : SS` (format timer shift). */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs} : ${mins} : ${secs}`;
}

/** ISO timestamp → `HH:MM WIB`. */
export function formatWibTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:-- WIB';

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);

  return `${time} WIB`;
}

/** Persentase kehadiran 0–100; 0 bila belum ada peserta terdaftar. */
export function attendancePercent(checkedIn: number, registered: number): number {
  if (registered <= 0) return 0;
  const percent = Math.round((checkedIn / registered) * 100);
  return Math.min(100, Math.max(0, percent));
}
