/** DTO untuk dashboard admin dan mutasi terkait. */

export type ShiftType = 'SHIFT_PAGI' | 'SHIFT_SIANG' | 'SHIFT_SORE' | 'SHIFT_MALAM';
export type ShiftApprovalStatus = 'ONGOING' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
export type VolunteerApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentAccountType = 'QRIS' | 'BANK_TRANSFER';
export type EventPaymentStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export interface AdminKpiCards {
  totalBookUnits: number;
  totalBookTitles: number;
  activeMembersCount: number;
  totalCirculationLoans: number;
  onTimeReturnPercentage: number;
  collectedDonationAmount: number;
  targetDonationAmount: number;
}

export interface AdminDashboardUser {
  id: string;
  name: string;
  memberCode: string;
  phone?: string | null;
}

export interface AdminDashboardBook {
  id: string;
  title: string;
  coverImage: string | null;
}

export interface OverdueCirculationAlert {
  id: string;
  dueDate: string;
  user: AdminDashboardUser;
  book: AdminDashboardBook;
}

export interface PendingVolunteerApplication {
  id: string;
  userId: string;
  majorOrJob: string;
  institution: string;
  division: string;
  motivation: string;
  cvDocument: string | null;
  status: VolunteerApplicationStatus;
  rejectionNote: string | null;
  createdAt: string;
  updatedAt: string;
  user: AdminDashboardUser & {
    email: string;
    avatar: string | null;
  };
}

export interface PendingVolunteerShift {
  id: string;
  userId: string;
  shiftType: ShiftType;
  location: string;
  taskSummary: string | null;
  clockInAt: string;
  clockOutAt: string | null;
  durationHours: string | number | null;
  approvalStatus: ShiftApprovalStatus;
  createdAt: string;
  updatedAt: string;
  user: AdminDashboardUser;
}

export interface ShiftHoursVerification {
  completedHoursThisWeek: number;
  weeklyTargetHours: number;
  fulfillmentPercentage: number;
  pendingShifts: PendingVolunteerShift[];
}

export interface SystemAuditLog {
  id: string;
  actorId: string | null;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface AdminDashboard {
  kpiCards: AdminKpiCards;
  overdueCirculationAlerts: OverdueCirculationAlert[];
  pendingVolunteerApplications: PendingVolunteerApplication[];
  shiftHoursVerification: ShiftHoursVerification;
  systemAuditLogs: SystemAuditLog[];
}

export interface PaymentAccount {
  id: string;
  type: PaymentAccountType;
  providerName: string;
  accountNumber: string | null;
  accountName: string | null;
  qrisImageUrl: string | null;
  qrisNmid: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventPaymentRegistration {
  id: string;
  ticketCode: string;
  status: string;
  paymentStatus: EventPaymentStatus | null;
  paymentProofUrl: string | null;
  paymentNote: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    eventDate: string;
    feeType: string;
    infaqAmount: string | number;
  };
  user: AdminDashboardUser & {
    email?: string | null;
    rtRw?: string | null;
  };
}


export interface ReviewVolunteerApplicationInput {
  status: Exclude<VolunteerApplicationStatus, 'PENDING'>;
  rejectionNote?: string;
}

export interface VerifyEventPaymentInput {
  status: Exclude<EventPaymentStatus, 'PENDING'>;
  paymentNote?: string;
}

export interface AdminEventSnapshot {
  id: string;
  title: string;
  eventDate: string;
  status: string;
  feeType: 'FREE' | 'INFAQ';
  infaqAmount: string | number;
  quota: number;
  registeredCount: number;
}

export interface AdminRegistrationSnapshot {
  id: string;
  ticketCode: string;
  status: string;
  paymentStatus: EventPaymentStatus | null;
  paymentNote: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    infaqAmount: string | number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    memberCode: string;
  };
}

export interface AdminBookDonationSnapshot {
  id: string;
  batchCode: string;
  donorName: string;
  packageTitle: string;
  totalBooks: number;
  status: string;
  createdAt: string;
}

export interface AdminVolunteerApplicationSnapshot {
  id: string;
  status: VolunteerApplicationStatus;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminAuditLogSnapshot {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface AdminAttendanceSnapshot {
  id: string;
  title: string;
  eventDate: string;
  registeredCount: number;
  attendedCount: number;
}
