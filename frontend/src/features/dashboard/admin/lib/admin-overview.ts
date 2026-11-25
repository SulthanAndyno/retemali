import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  AdminAttendanceSnapshot,
  AdminAuditLogSnapshot,
  AdminBookDonationSnapshot,
  AdminEventSnapshot,
  AdminFinancialDonationSnapshot,
  AdminRegistrationSnapshot,
  AdminUserCounts,
  AdminVolunteerApplicationSnapshot,
} from '../types/admin.types';

type Envelope<T> = ApiEnvelope<T> & { meta: PaginatedMeta };
type MemberEnvelope = ApiEnvelope<unknown[]> & {
  meta: PaginatedMeta;
  counts?: AdminUserCounts;
};
type AttendanceEnvelope = ApiEnvelope<{ events: AdminAttendanceSnapshot[] }>;

export interface AdminOverviewResults {
  books: PromiseSettledResult<Envelope<unknown[]>>;
  members: PromiseSettledResult<MemberEnvelope>;
  events: PromiseSettledResult<Envelope<AdminEventSnapshot[]>>;
  pendingPayments: PromiseSettledResult<Envelope<AdminRegistrationSnapshot[]>>;
  pendingFinancialDonations: PromiseSettledResult<
    Envelope<AdminFinancialDonationSnapshot[]>
  >;
  financialDonations: PromiseSettledResult<
    Envelope<AdminFinancialDonationSnapshot[]>
  >;
  registrations: PromiseSettledResult<Envelope<AdminRegistrationSnapshot[]>>;
  bookDonations: PromiseSettledResult<Envelope<AdminBookDonationSnapshot[]>>;
  applications: PromiseSettledResult<Envelope<AdminVolunteerApplicationSnapshot[]>>;
  audit: PromiseSettledResult<Envelope<AdminAuditLogSnapshot[]>>;
  attendance: PromiseSettledResult<AttendanceEnvelope>;
}

export interface AdminOverviewData {
  booksTotal: number;
  membersTotal: number;
  activeMembers: number;
  events: AdminEventSnapshot[];
  eventsTotal: number;
  upcomingEvents: number;
  registrationsTotal: number;
  pendingPayments: AdminRegistrationSnapshot[];
  pendingPaymentCount: number;
  pendingFinancialDonations: AdminFinancialDonationSnapshot[];
  pendingFinancialCount: number;
  financialDonations: AdminFinancialDonationSnapshot[];
  pendingBookDonations: AdminBookDonationSnapshot[];
  pendingBookDonationCount: number;
  applications: AdminVolunteerApplicationSnapshot[];
  pendingVolunteerCount: number;
  approvedVolunteerCount: number;
  auditLogs: AdminAuditLogSnapshot[];
  attendance: AdminAttendanceSnapshot[];
  attendedTotal: number;
}

export interface AdminOverviewBuild {
  data: AdminOverviewData;
  failedSources: string[];
}

export const EMPTY_ADMIN_OVERVIEW: AdminOverviewData = {
  booksTotal: 0,
  membersTotal: 0,
  activeMembers: 0,
  events: [],
  eventsTotal: 0,
  upcomingEvents: 0,
  registrationsTotal: 0,
  pendingPayments: [],
  pendingPaymentCount: 0,
  pendingFinancialDonations: [],
  pendingFinancialCount: 0,
  financialDonations: [],
  pendingBookDonations: [],
  pendingBookDonationCount: 0,
  applications: [],
  pendingVolunteerCount: 0,
  approvedVolunteerCount: 0,
  auditLogs: [],
  attendance: [],
  attendedTotal: 0,
};

function read<T>(
  label: string,
  result: PromiseSettledResult<T>,
  failedSources: string[]
): T | null {
  if (result.status === 'fulfilled') return result.value;
  failedSources.push(label);
  return null;
}

export function buildAdminOverview(
  results: AdminOverviewResults,
  now = Date.now()
): AdminOverviewBuild {
  const failedSources: string[] = [];
  const books = read('buku', results.books, failedSources);
  const members = read('anggota', results.members, failedSources);
  const events = read('kegiatan', results.events, failedSources);
  const pendingPayments = read('pembayaran', results.pendingPayments, failedSources);
  const pendingFinancialDonations = read(
    'donasi finansial tertunda',
    results.pendingFinancialDonations,
    failedSources
  );
  const financialDonations = read(
    'donasi finansial',
    results.financialDonations,
    failedSources
  );
  const registrations = read('pendaftaran', results.registrations, failedSources);
  const bookDonations = read('donasi buku', results.bookDonations, failedSources);
  const applications = read('volunteer', results.applications, failedSources);
  const auditLogs = read('audit', results.audit, failedSources);
  const attendance = read('presensi', results.attendance, failedSources);

  const eventRows = events?.data ?? [];
  const applicationRows = applications?.data ?? [];
  const attendanceRows = [...(attendance?.data?.events ?? [])]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, 5);
  const membersTotal = members?.meta?.total ?? 0;

  return {
    failedSources,
    data: {
      ...EMPTY_ADMIN_OVERVIEW,
      booksTotal: books?.meta?.total ?? 0,
      membersTotal,
      activeMembers: members?.counts?.active ?? membersTotal,
      events: eventRows,
      eventsTotal: events?.meta?.total ?? eventRows.length,
      upcomingEvents: eventRows.filter(
        (event) =>
          event.status === 'PUBLISHED' && new Date(event.eventDate).getTime() > now
      ).length,
      registrationsTotal: registrations?.meta?.total ?? 0,
      pendingPayments: pendingPayments?.data ?? [],
      pendingPaymentCount: pendingPayments?.meta?.total ?? 0,
      pendingFinancialDonations: pendingFinancialDonations?.data ?? [],
      pendingFinancialCount: pendingFinancialDonations?.meta?.total ?? 0,
      financialDonations: financialDonations?.data ?? [],
      pendingBookDonations: bookDonations?.data ?? [],
      pendingBookDonationCount: bookDonations?.meta?.total ?? 0,
      applications: applicationRows,
      pendingVolunteerCount: applicationRows.filter((item) => item.status === 'PENDING')
        .length,
      approvedVolunteerCount: applicationRows.filter(
        (item) => item.status === 'APPROVED'
      ).length,
      auditLogs: auditLogs?.data ?? [],
      attendance: attendanceRows,
      attendedTotal: attendanceRows.reduce(
        (sum, event) => sum + event.attendedCount,
        0
      ),
    },
  };
}
