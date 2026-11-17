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

export interface CashFilters {
  from: string;
  to: string;
}

export type CashCategory =
  | 'DONASI_FINANSIAL'
  | 'INFAQ_KEGIATAN'
  | 'DENDA_SIRKULASI';

export interface CashEntry {
  id: string;
  date: string;
  category: CashCategory;
  categoryLabel: string;
  label: string;
  method: string;
  reference: string;
  amount: number;
  status: string;
}

export interface CashReport {
  generatedAt: string;
  period: ReportPeriod;
  summary: {
    totalIncome: number;
    totalExpense: number;
    netCashFlow: number;
    donationIncome: number;
    eventInfaqIncome: number;
    fineIncome: number;
    transactionCount: number;
  };
  byCategory: Array<{
    category: CashCategory;
    label: string;
    amount: number;
    count: number;
  }>;
  byMethod: Array<{ method: string; amount: number; count: number }>;
  byMonth: Array<{ month: string; label: string; income: number }>;
  entries: CashEntry[];
  dataSources: { donations: boolean; events: boolean; loans: boolean };
  expenseTracking: { available: boolean; reason: string };
}

export interface UpstreamCashTransaction {
  id: string;
  source: 'DONATION' | 'EVENT_INFAQ' | 'CIRCULATION_FINE';
  title: string;
  payerOrDonor: string;
  amount: string | number;
  paymentMethod: string;
  referenceCode: string;
  date: string;
}

export interface UpstreamCashReport {
  period?: ReportPeriod;
  summary?: {
    totalIncome?: string | number;
    totalDonations?: string | number;
    totalEventInfaq?: string | number;
    totalFines?: string | number;
    totalTransactions?: string | number;
  };
  byPaymentMethod?: Record<string, string | number>;
  transactions?: UpstreamCashTransaction[];
}

