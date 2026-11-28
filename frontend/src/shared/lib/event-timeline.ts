/**
 * Shared event timeline + quota helpers.
 *
 * Pure functions (no server-only imports) so they can run both in the browser
 * and inside route handlers. The timeline is derived from the event's date and
 * start/end time, which is what makes "automated closing" work without a cron
 * job or a database change: an event whose end time has passed is treated as
 * closed everywhere in the UI, even before an admin flips its status.
 */

export type EventPhase =
  | 'UPCOMING'
  | 'ONGOING'
  | 'ENDED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DRAFT';

export type EventTone = 'blue' | 'emerald' | 'slate' | 'rose' | 'amber';

export interface EventLike {
  eventDate: string | Date;
  startTime?: string | null;
  endTime?: string | null;
  quota?: number | null;
  registeredCount?: number | null;
  status?: string | null;
  /** H-3 / H-2 / H-1 sebelum pelaksanaan (default H-1). */
  registrationCloseOffsetDays?: number | null;
}

export interface EventTimeline {
  phase: EventPhase;
  label: string;
  tone: EventTone;
  isRegistrationOpen: boolean;
  isAutoClosed: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  /** Batas pendaftaran = mulai kegiatan − offset hari (WIB). */
  registrationCloseAt: Date | null;
  closeOffsetDays: number;
  /** "H-3" / "H-2" / "H-1". */
  closeRule: string;
  closedReason: string | null;
}

export interface QuotaState {
  quota: number;
  registered: number;
  seatsLeft: number;
  isFull: boolean;
  percent: number;
  label: string;
  tone: EventTone;
}

const TIME_PATTERN = /^(\d{1,2})[:.](\d{2})/;
const DAY_IN_MS = 86_400_000;
const WIB_TIME_ZONE = 'Asia/Jakarta';
export const DEFAULT_CLOSE_OFFSET_DAYS = 1;

function parseTime(value?: string | null): { hours: number; minutes: number } | null {
  if (!value) return null;
  const match = TIME_PATTERN.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

/** Tanggal kalender WIB (YYYY-MM-DD) — bukan tanggal lokal browser/UTC. */
function wibDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WIB_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Instant absolut untuk jam WIB tertentu pada tanggal kalender WIB. */
function wibInstant(ymd: string, hours = 0, minutes = 0): Date {
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return new Date(`${ymd}T${hh}:${mm}:00.000+07:00`);
}

/** Menggabungkan tanggal kegiatan + jam WIB menjadi instant absolut. */
function combineWib(
  date: Date,
  time: string | null | undefined,
  fallback: Date | null
): Date | null {
  const parsed = parseTime(time);
  if (!parsed) return fallback;
  return wibInstant(wibDateString(date), parsed.hours, parsed.minutes);
}

/** Normalisasi offset H-N ke 1..3 hari. */
export function normalizeCloseOffsetDays(value?: number | null): number {
  const days = Number(value);
  if (!Number.isFinite(days)) return DEFAULT_CLOSE_OFFSET_DAYS;
  return Math.min(3, Math.max(1, Math.trunc(days)));
}

export function formatCloseRule(value?: number | null): string {
  return `H-${normalizeCloseOffsetDays(value)}`;
}

/** Format tanggal + jam WIB untuk badge tenggat pendaftaran. */
export function formatWibDateTime(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '-';
  const day = new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  const time = new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return `${day}, ${time} WIB`;
}

const PHASE_META: Record<EventPhase, { label: string; tone: EventTone; open: boolean }> = {
  UPCOMING: { label: 'Akan Datang', tone: 'blue', open: true },
  ONGOING: { label: 'Sedang Berlangsung', tone: 'emerald', open: false },
  ENDED: { label: 'Selesai • Ditutup Otomatis', tone: 'slate', open: false },
  CLOSED: { label: 'Pendaftaran Ditutup', tone: 'slate', open: false },
  COMPLETED: { label: 'Selesai', tone: 'slate', open: false },
  CANCELLED: { label: 'Dibatalkan', tone: 'rose', open: false },
  DRAFT: { label: 'Draf', tone: 'amber', open: false },
};

/**
 * Derives the live phase of an event from its schedule in WIB, honouring
 * explicit terminal statuses (COMPLETED / CANCELLED / DRAFT) when present.
 *
 * The registration cutoff is `eventStart − registrationCloseOffsetDays`
 * (H-3, H-2 or H-1), computed against Asia/Jakarta rather than the browser's
 * local clock, so a visitor in another timezone sees the same deadline the
 * server enforces.
 */
export function computeEventTimeline(event: EventLike, now: Date = new Date()): EventTimeline {
  const rawDate = typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate;
  const hasValidDate = !Number.isNaN(rawDate.getTime());
  const baseDate = hasValidDate ? rawDate : null;

  const closeOffsetDays = normalizeCloseOffsetDays(event.registrationCloseOffsetDays);
  const closeRule = formatCloseRule(closeOffsetDays);

  const startsAt = baseDate ? combineWib(baseDate, event.startTime, baseDate) : null;
  let endsAt = baseDate ? combineWib(baseDate, event.endTime, null) : null;

  if (startsAt && endsAt && endsAt.getTime() <= startsAt.getTime()) {
    // Session crossing midnight (e.g. 19:30 → 00:30).
    endsAt = new Date(endsAt.getTime() + DAY_IN_MS);
  }
  if (startsAt && !endsAt) {
    endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
  }

  const registrationCloseAt = startsAt
    ? new Date(startsAt.getTime() - closeOffsetDays * DAY_IN_MS)
    : null;

  const status = (event.status ?? '').toUpperCase();

  let phase: EventPhase;
  let closedReason: string | null = null;

  if (status === 'CANCELLED') {
    phase = 'CANCELLED';
    closedReason = 'Kegiatan dibatalkan oleh panitia.';
  } else if (status === 'DRAFT') {
    phase = 'DRAFT';
    closedReason = 'Kegiatan masih berstatus draf dan belum dipublikasikan.';
  } else if (status === 'COMPLETED') {
    phase = 'COMPLETED';
    closedReason = 'Kegiatan telah ditandai selesai oleh panitia.';
  } else if (!startsAt || !endsAt) {
    phase = 'UPCOMING';
  } else if (now.getTime() > endsAt.getTime()) {
    phase = 'ENDED';
    closedReason = 'Waktu pelaksanaan telah berakhir — pendaftaran ditutup otomatis.';
  } else if (now.getTime() >= startsAt.getTime()) {
    phase = 'ONGOING';
    closedReason = `Kegiatan sedang berlangsung; pendaftaran sudah ditutup sejak ${closeRule}.`;
  } else if (registrationCloseAt && now.getTime() >= registrationCloseAt.getTime()) {
    phase = 'CLOSED';
    closedReason = `Pendaftaran ditutup otomatis ${closeRule} sebelum pelaksanaan (${formatWibDateTime(registrationCloseAt)}).`;
  } else {
    phase = 'UPCOMING';
  }

  const meta = PHASE_META[phase];
  const label =
    phase === 'CLOSED'
      ? `Pendaftaran Ditutup (${closeRule})`
      : phase === 'ONGOING'
        ? `Sedang Berlangsung • Pendaftaran Ditutup (${closeRule})`
        : meta.label;

  return {
    phase,
    label,
    tone: meta.tone,
    isRegistrationOpen: meta.open,
    isAutoClosed: phase === 'ENDED' || phase === 'CLOSED',
    startsAt,
    endsAt,
    registrationCloseAt,
    closeOffsetDays,
    closeRule,
    closedReason,
  };
}

/**
 * Normalises quota/registration counters into a UI-friendly state.
 */
export function computeQuotaState(
  quota?: number | null,
  registered?: number | null
): QuotaState {
  const totalQuota = Math.max(0, Number(quota ?? 0));
  const totalRegistered = Math.max(0, Number(registered ?? 0));
  const seatsLeft = Math.max(0, totalQuota - totalRegistered);
  const percent =
    totalQuota > 0 ? Math.min(100, Math.round((totalRegistered / totalQuota) * 100)) : 0;
  const isFull = totalQuota > 0 && seatsLeft === 0;

  return {
    quota: totalQuota,
    registered: totalRegistered,
    seatsLeft,
    isFull,
    percent,
    label: isFull ? 'Kuota Penuh' : `Sisa ${seatsLeft} kuota`,
    tone: isFull ? 'rose' : percent >= 80 ? 'amber' : 'emerald',
  };
}

export interface RegistrationGate {
  allowed: boolean;
  reason: string | null;
  badge: string;
}

/**
 * Single source of truth for whether the "Daftar" button should be clickable.
 */
export function getRegistrationGate(event: EventLike, now: Date = new Date()): RegistrationGate {
  const timeline = computeEventTimeline(event, now);
  const quota = computeQuotaState(event.quota, event.registeredCount);

  if (!timeline.isRegistrationOpen) {
    return {
      allowed: false,
      reason: timeline.closedReason ?? 'Pendaftaran ditutup.',
      badge: timeline.label,
    };
  }

  if (quota.isFull) {
    return {
      allowed: false,
      reason: 'Kuota peserta sudah penuh.',
      badge: 'Kuota Penuh',
    };
  }

  return { allowed: true, reason: null, badge: quota.label };
}

export const TONE_CLASSES: Record<EventTone, string> = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-200 text-slate-700',
  rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-800',
};

export const TONE_BAR_CLASSES: Record<EventTone, string> = {
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-400',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
};

/** True when the event date falls within the next/previous 7 days. */
export function isThisWeek(eventDate: string, now = Date.now()): boolean {
  const timestamp = new Date(eventDate).getTime();
  if (Number.isNaN(timestamp)) return false;
  return Math.abs(timestamp - now) <= 7 * DAY_IN_MS;
}

export type ServerEventState = Pick<
  EventTimeline,
  'phase' | 'label' | 'isRegistrationOpen' | 'isAutoClosed' | 'closedReason'
>;

/**
 * Server-evaluated timeline (auto-close route) wins over local computation;
 * quota counters always come from the current event payload.
 */
export function resolveEventState(
  event: EventLike,
  serverState?: ServerEventState | null
) {
  const local = computeEventTimeline(event);
  const timeline: EventTimeline = serverState
    ? {
        ...local,
        phase: serverState.phase,
        label: serverState.label,
        isRegistrationOpen: serverState.isRegistrationOpen,
        isAutoClosed: serverState.isAutoClosed,
        closedReason: serverState.closedReason,
      }
    : local;

  return {
    timeline,
    quota: computeQuotaState(event.quota, event.registeredCount),
  };
}
