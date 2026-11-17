/**
 * DTO untuk `GET /api/dashboard/volunteer` dan mutasi terkait.
 * Sumber: docs/api/dashboard.md, circulation.md, events.md, donations.md, volunteers.md.
 */

export type ShiftType = 'SHIFT_PAGI' | 'SHIFT_SIANG' | 'SHIFT_SORE' | 'SHIFT_MALAM';
export type ShiftApproval = 'ONGOING' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
export type ReturnCondition = 'GOOD' | 'MINOR_DAMAGE' | 'MAJOR_DAMAGE' | 'LOST';

export interface VolunteerShiftUser {
  id: string;
  name: string;
  memberCode: string;
  avatar: string | null;
}

export interface VolunteerShift {
  id: string;
  userId: string;
  shiftType: ShiftType;
  location: string;
  taskSummary: string | null;
  clockInAt: string;
  clockOutAt: string | null;
  durationHours: string | null;
  approvalStatus: ShiftApproval;
  user: VolunteerShiftUser;
}

export interface TodayMetrics {
  borrowedToday: number;
  returnedToday: number;
  overdueCount: number;
  checkedInTickets: number;
  totalEventQuota: number;
}

export interface OngoingEventAttendance {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  checkedInCount: number;
  registeredCount: number;
  quota: number;
}

export interface PendingBookDonation {
  id: string;
  batchCode: string;
  donorName: string;
  donorBadge: string | null;
  isAnonymous: boolean;
  packageTitle: string;
  totalBooks: number;
  conditionNote: string;
  createdAt: string;
}

export interface VolunteerDashboard {
  activeShiftDesk: {
    myActiveShift: VolunteerShift | null;
    onDutyVolunteers: VolunteerShift[];
  };
  todayMetrics: TodayMetrics;
  ongoingEventAttendance: OngoingEventAttendance | null;
  pendingBookDonations: PendingBookDonation[];
}

export interface ClockInInput {
  shiftType: ShiftType;
  location?: string;
  taskSummary?: string;
}

export interface ClockOutInput {
  taskSummary: string;
  durationHours?: number;
}

export interface QuickCheckoutInput {
  memberIdentifier: string;
  bookIdentifier: string;
  durationDays?: number;
}

export interface QuickReturnInput {
  bookIdentifier: string;
  returnCondition: ReturnCondition;
}

export interface VerifyBookDonationInput {
  status: 'ACCEPTED' | 'REJECTED';
  curationNote?: string;
}

export interface HandoverNoteInput {
  shiftType: ShiftType;
  content: string;
  tags: string[];
}
