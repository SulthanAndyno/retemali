/**
 * Utility Waktu Indonesia Barat (WIB / Asia/Jakarta - UTC+7)
 * Memastikan seluruh logika tanggal, batas pendaftaran H-3, dan filter harian
 * berjalan konsisten dalam zona waktu Indonesia meskipun server/VPS menggunakan UTC.
 */

export const WIB_TIMEZONE = "Asia/Jakarta";
export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
export const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const EVENT_CLOSE_DAYS_BEFORE = 3; // Aturan lama: penutupan otomatis H-3

/**
 * Offset penutupan pendaftaran yang didukung (hari sebelum pelaksanaan).
 * Setiap kegiatan menyimpan pilihannya di kolom
 * `CommunityEvent.registrationCloseOffsetDays`.
 */
export const EVENT_CLOSE_OFFSET_DAYS = {
  MIN: 1,
  MAX: 3,
  DEFAULT: 1,
} as const;

export const EVENT_CLOSE_OFFSET_OPTIONS = [3, 2, 1] as const;

/** Menjepit offset apa pun ke rentang 1..3 hari (default 1). */
export function normalizeCloseOffsetDays(days?: number | null): number {
  const value = Number(days);
  if (!Number.isFinite(value)) return EVENT_CLOSE_OFFSET_DAYS.DEFAULT;
  return Math.min(
    EVENT_CLOSE_OFFSET_DAYS.MAX,
    Math.max(EVENT_CLOSE_OFFSET_DAYS.MIN, Math.trunc(value)),
  );
}

/** Label "H-3" / "H-2" / "H-1" untuk offset penutupan. */
export function formatCloseRule(days?: number | null): string {
  return `H-${normalizeCloseOffsetDays(days)}`;
}

/**
 * Mengambil tanggal kalender "YYYY-MM-DD" dalam zona waktu WIB (Asia/Jakarta).
 */
export function getWibDateString(dateInput: Date | string = new Date()): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) {
    return getWibDateString(new Date());
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date); // Format: YYYY-MM-DD
}

/**
 * Mengambil timestamp awal hari ini (00:00:00.000 WIB) sebagai objek Date.
 */
export function getStartOfTodayWib(now: Date = new Date()): Date {
  const ymd = getWibDateString(now);
  return new Date(`${ymd}T00:00:00.000+07:00`);
}

/**
 * Mengambil timestamp akhir hari ini (23:59:59.999 WIB) sebagai objek Date.
 */
export function getEndOfTodayWib(now: Date = new Date()): Date {
  const ymd = getWibDateString(now);
  return new Date(`${ymd}T23:59:59.999+07:00`);
}

/**
 * Akhir hari (23:59:59.999 WIB) untuk tanggal kalender apa pun.
 * Dipakai agar tenggat peminjaman buku jatuh pada penghujung hari WIB,
 * bukan pada jam yang sama saat buku dipinjamkan.
 */
export function getEndOfDayWib(dateInput: Date | string): Date {
  const ymd = getWibDateString(dateInput);
  return new Date(`${ymd}T23:59:59.999+07:00`);
}

/**
 * Menambah N hari kalender lalu mengembalikan akhir hari WIB-nya.
 * Contoh: pinjam 14 hari pada 23 Nov 10:00 WIB -> tenggat 7 Des 23:59:59 WIB.
 */
export function addDaysEndOfDayWib(
  dateInput: Date | string,
  days: number,
): Date {
  const base = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const shifted = new Date(base.getTime() + days * DAY_IN_MS);
  return getEndOfDayWib(shifted);
}

/**
 * Tahun kalender WIB. Kode transaksi (LN-YYYY-xxxx, DON-YYYY-xxxx) harus
 * memakai tahun WIB, bukan tahun UTC server.
 */
export function getWibYear(dateInput: Date | string = new Date()): number {
  return Number(getWibDateString(dateInput).slice(0, 4));
}

/**
 * Mengurai string jam "HH:mm" atau "HH.mm" menjadi jam & menit yang valid.
 */
export function parseTimeWib(
  timeStr?: string | null,
): { hours: string; minutes: string } {
  if (!timeStr) {
    return { hours: "00", minutes: "00" };
  }
  const match = /^(\d{1,2})[:.](\d{2})/.exec(timeStr.trim());
  if (!match) {
    return { hours: "00", minutes: "00" };
  }
  const h = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const m = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
  };
}

/**
 * Menggabungkan tanggal kegiatan (eventDate) dan jam (misal "09:00")
 * menjadi objek Date absolut berpatokan pada WIB (+07:00).
 */
export function combineEventDateTimeWib(
  eventDate: Date | string,
  timeStr?: string | null,
): Date {
  const ymd = getWibDateString(eventDate);
  const { hours, minutes } = parseTimeWib(timeStr);
  return new Date(`${ymd}T${hours}:${minutes}:00.000+07:00`);
}

/**
 * Menghitung batas waktu penutupan pendaftaran otomatis (H-N hari sebelum
 * pelaksanaan) dalam WIB. N diambil dari kolom
 * `registrationCloseOffsetDays` milik kegiatan (1, 2, atau 3).
 */
export function getEventRegistrationCutoffWib(
  eventDate: Date | string,
  startTime?: string | null,
  daysBefore: number = EVENT_CLOSE_OFFSET_DAYS.DEFAULT,
): Date {
  const eventStart = combineEventDateTimeWib(eventDate, startTime);
  const offset = normalizeCloseOffsetDays(daysBefore);
  return new Date(eventStart.getTime() - offset * DAY_IN_MS);
}

/**
 * Format tanggal ke Bahasa Indonesia dengan zona waktu WIB (contoh: "20 Desember 2026").
 */
export function formatDateWib(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    timeZone: WIB_TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal & jam lengkap ke Bahasa Indonesia dengan label WIB
 * (contoh: "20 Desember 2026, 09.00 WIB").
 */
export function formatDateTimeWib(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "-";

  const datePart = formatDateWib(date);
  const timePart = date.toLocaleTimeString("id-ID", {
    timeZone: WIB_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart}, ${timePart} WIB`;
}

/**
 * Mengonversi Date menjadi string ISO dengan offset eksplisit +07:00 (WIB).
 */
export function toWibIsoString(dateInput: Date | string = new Date()): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return new Date().toISOString();

  const wibTime = new Date(date.getTime() + WIB_OFFSET_MS);
  return wibTime.toISOString().replace("Z", "+07:00");
}
