import 'server-only';
import { upstreamRequest } from '@/shared/lib/server-upstream';
import {
  computeEventTimeline,
  computeQuotaState,
  formatWibDateTime,
} from '@/shared/lib/event-timeline';

interface UpstreamEvent {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  quota: number;
  registeredCount: number;
  status: string;
  registrationCloseOffsetDays?: number;
}

export interface AutoCloseResult {
  ok: boolean;
  status: number;
  error: string | null;
  data: {
    evaluatedAt: string;
    events: Array<{
      id: string;
      title: string;
      phase: string;
      label: string;
      isRegistrationOpen: boolean;
      isAutoClosed: boolean;
      closedReason: string | null;
      startsAt: string | null;
      endsAt: string | null;
      quota: number;
      registeredCount: number;
      seatsLeft: number;
      isQuotaFull: boolean;
      quotaPercent: number;
      registrationCloseAtWib: string | null;
      closeRule: string;
      closeOffsetDays: number;
    }>;
  } | null;
}

export async function loadAutoCloseStates(
  token: string | null
): Promise<AutoCloseResult> {
  const upstream = await upstreamRequest<{ data: UpstreamEvent[] }>(
    '/events?limit=100',
    { token }
  );

  if (!upstream.ok) {
    return {
      ok: false,
      status: upstream.status || 502,
      error:
        upstream.error ?? 'Gagal mengevaluasi status kegiatan.',
      data: null,
    };
  }

  const now = new Date();
  const events = (upstream.data?.data ?? []).map((event) => {
    const timeline = computeEventTimeline(event, now);
    const quota = computeQuotaState(event.quota, event.registeredCount);

    return {
      id: event.id,
      title: event.title,
      phase: timeline.phase,
      label: timeline.label,
      isRegistrationOpen: timeline.isRegistrationOpen,
      isAutoClosed: timeline.isAutoClosed,
      closedReason: timeline.closedReason,
      startsAt: timeline.startsAt ? timeline.startsAt.toISOString() : null,
      endsAt: timeline.endsAt ? timeline.endsAt.toISOString() : null,
      quota: quota.quota,
      registeredCount: quota.registered,
      seatsLeft: quota.seatsLeft,
      isQuotaFull: quota.isFull,
      quotaPercent: quota.percent,
      registrationCloseAtWib: timeline.registrationCloseAt
        ? formatWibDateTime(timeline.registrationCloseAt)
        : null,
      closeRule: timeline.closeRule,
      closeOffsetDays: timeline.closeOffsetDays,
    };
  });

  return {
    ok: true,
    status: 200,
    error: null,
    data: { evaluatedAt: now.toISOString(), events },
  };
}
