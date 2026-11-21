/**
 * Utility Waktu Indonesia Barat (WIB / Asia/Jakarta - UTC+7)
 * Memastikan seluruh logika tanggal, batas pendaftaran H-3, dan filter harian
 * berjalan konsisten dalam zona waktu Indonesia meskipun server/VPS menggunakan UTC.
 */

export const WIB_TIMEZONE = "Asia/Jakarta";
export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
export const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const EVENT_CLOSE_DAYS_BEFORE = 3; // Penutupan otomatis H-3 sebelum kegiatan

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
 * Menghitung batas waktu penutupan pendaftaran otomatis H-3 (3 hari sebelum pelaksanaan) dalam WIB.
 */
export function getEventRegistrationCutoffWib(
  eventDate: Date | string,
  startTime?: string | null,
  daysBefore: number = EVENT_CLOSE_DAYS_BEFORE,
): Date {
  const eventStart = combineEventDateTimeWib(eventDate, startTime);
  return new Date(eventStart.getTime() - daysBefore * DAY_IN_MS);
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
