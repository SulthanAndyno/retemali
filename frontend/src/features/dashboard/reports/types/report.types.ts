import type { EventPhase } from '@/features/events/lib/events';

export interface ReportPeriod {
  from: string | null;
  to: string | null;
}

export interface AttendanceFilters {
  from: string;
  to: string;
  eventId: string;
}

export interface ReportError {
  message: string;
  status: number;
}

export interface EventOption {
  id: string;
  title: string;
}

export type TicketState = 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED';

export interface AttendanceParticipant {
  registrationId: string;
  ticketCode: string;
  memberCode: string;
  memberName: string;
  memberPhone: string | null;
  memberRtRw: string | null;
  status: TicketState;
  registeredAt: string;
  checkedInAt: string | null;
}

export interface AttendanceEventRow {
  eventId: string;
  title: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  facilitatorName: string;
  phase: EventPhase;
  phaseLabel: string;
  isAutoClosed: boolean;
  quota: number;
  registeredCount: number;
  activeRegistered: number;
  checkedInCount: number;
  cancelledCount: number;
  noShowCount: number;
  attendanceRate: number;
  participants: AttendanceParticipant[];
}

export interface AttendanceTotals {
  events: number;
  quota: number;
  registered: number;
  checkedIn: number;
  cancelled: number;
  noShow: number;
  attendanceRate: number;
  autoClosedEvents: number;
}

export interface AttendanceReport {
  generatedAt: string;
  period: ReportPeriod;
  totals: AttendanceTotals;
  events: AttendanceEventRow[];
}

export interface UpstreamAttendanceParticipant {
  registrationId: string;
  ticketCode: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    memberCode?: string;
    phone?: string | null;
  } | null;
  status: string;
  checkedInAt: string | null;
  paymentProofUrl?: string | null;
  paymentStatus?: string | null;
  registeredAt: string;
}

export interface UpstreamAttendanceEvent {
  id: string;
  title: string;
  slug?: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  quota: number;
  registeredCount: number;
  attendedCount?: number;
  attendanceRate?: string | number;
  status?: string;
  participants?: UpstreamAttendanceParticipant[];
}

export interface UpstreamAttendancePayload {
  period?: ReportPeriod;
  summary?: {
    totalEvents?: number;
    totalRegistered?: number;
    totalAttended?: number;
    overallAttendanceRate?: string | number;
  };
  events?: UpstreamAttendanceEvent[];
}
