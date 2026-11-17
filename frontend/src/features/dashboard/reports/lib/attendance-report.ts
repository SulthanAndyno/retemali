import {
  computeEventTimeline,
  computeQuotaState,
} from '@/features/events/lib/events';
import { attendancePercent, parsePercent } from './report-format';
import type {
  AttendanceEventRow,
  AttendanceParticipant,
  AttendanceReport,
  AttendanceTotals,
  ReportPeriod,
  TicketState,
  UpstreamAttendanceEvent,
  UpstreamAttendancePayload,
} from '../types/report.types';

function toTicketState(status: string): TicketState {
  if (status === 'CHECKED_IN' || status === 'CANCELLED') return status;
  return 'REGISTERED';
}

function mapParticipant(
  participant: NonNullable<UpstreamAttendanceEvent['participants']>[number]
): AttendanceParticipant {
  return {
    registrationId: participant.registrationId,
    ticketCode: participant.ticketCode,
    memberCode: participant.user?.memberCode ?? '-',
    memberName: participant.user?.name ?? '-',
    memberPhone: participant.user?.phone ?? null,
    memberRtRw: null,
    status: toTicketState(participant.status),
    registeredAt: participant.registeredAt,
    checkedInAt: participant.checkedInAt ?? null,
  };
}

function mapEvent(event: UpstreamAttendanceEvent): AttendanceEventRow {
  const timeline = computeEventTimeline(event);
  const quota = computeQuotaState(event.quota, event.registeredCount);
  const participants = (event.participants ?? []).map(mapParticipant);
  const checkedInCount =
    event.attendedCount ??
    participants.filter(
      (participant) =>
        participant.status === 'CHECKED_IN' || participant.checkedInAt !== null
    ).length;
  const cancelledCount = participants.filter(
    (participant) => participant.status === 'CANCELLED'
  ).length;
  const activeRegistered = Math.max(
    0,
    (event.registeredCount ?? participants.length) - cancelledCount
  );
  const sessionFinished = timeline.phase === 'ENDED' || timeline.phase === 'COMPLETED';

  return {
    eventId: event.id,
    title: event.title,
    category: event.category,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    location: '-',
    facilitatorName: '-',
    phase: timeline.phase,
    phaseLabel: timeline.label,
    isAutoClosed: timeline.isAutoClosed,
    quota: quota.quota,
    registeredCount: event.registeredCount ?? quota.registered,
    activeRegistered,
    checkedInCount,
    cancelledCount,
    noShowCount: sessionFinished ? Math.max(0, activeRegistered - checkedInCount) : 0,
    attendanceRate: event.attendanceRate
      ? parsePercent(event.attendanceRate)
      : attendancePercent(checkedInCount, activeRegistered),
    participants,
  };
}

export function buildAttendanceReport(
  payload: UpstreamAttendancePayload,
  period: ReportPeriod,
  generatedAt: string
): AttendanceReport {
  const events = (payload.events ?? []).map(mapEvent);

  const derived: AttendanceTotals = events.reduce(
    (acc, event) => {
      acc.quota += event.quota;
      acc.registered += event.activeRegistered;
      acc.checkedIn += event.checkedInCount;
      acc.cancelled += event.cancelledCount;
      acc.noShow += event.noShowCount;
      if (event.isAutoClosed) acc.autoClosedEvents += 1;
      return acc;
    },
    {
      events: events.length,
      quota: 0,
      registered: 0,
      checkedIn: 0,
      cancelled: 0,
      noShow: 0,
      attendanceRate: 0,
      autoClosedEvents: 0,
    }
  );

  const summary = payload.summary;
  const totals: AttendanceTotals = {
    ...derived,
    events: summary?.totalEvents ?? derived.events,
    registered: summary?.totalRegistered ?? derived.registered,
    checkedIn: summary?.totalAttended ?? derived.checkedIn,
    attendanceRate:
      summary?.overallAttendanceRate !== undefined
        ? parsePercent(summary.overallAttendanceRate)
        : attendancePercent(
            summary?.totalAttended ?? derived.checkedIn,
            summary?.totalRegistered ?? derived.registered
          ),
  };

  return { generatedAt, period, totals, events };
}
