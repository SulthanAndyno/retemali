/**
 * DTO untuk `GET /api/dashboard/member` dan mutasi terkait.
 * Sumber: docs/api/dashboard.md, docs/api/circulation.md, docs/api/volunteers.md.
 */

export type Role = 'MEMBER' | 'VOLUNTEER' | 'DONOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface MemberCard {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string | null;
  rtRw: string | null;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  points: number;
  readingTarget: number;
}

export interface ActivitySummary {
  activeLoansCount: number;
  readyPickupCount: number;
  booksReadCount: number;
  readingTarget: number;
  targetProgressPercent: number;
  registeredEventsCount: number;
}

export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type ReservationStatus = 'READY_FOR_PICKUP' | 'CLAIMED' | 'EXPIRED' | 'CANCELLED';
export type TicketStatus = 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED';

/** Subset field yang dipakai UI; backend mengirim objek penuh (`include: true`). */
export interface BookRef {
  id: string;
  bookCode: string;
  title: string;
  author: string;
  shelfLocation: string;
  availableStock: number;
}

export interface ActiveLoan {
  id: string;
  loanCode: string;
  borrowedAt: string;
  dueDate: string;
  extendedCount: number;
  fineAmount: string;
  status: LoanStatus;
  book: BookRef;
}

export interface ReadyReservation {
  id: string;
  reservationCode: string;
  pickupCounter: string;
  expiresAt: string;
  status: ReservationStatus;
  book: BookRef;
}

export interface EventRef {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface MyTicket {
  id: string;
  ticketCode: string;
  status: TicketStatus;
  event: EventRef;
}

export interface RecommendedBook {
  id: string;
  bookCode: string;
  title: string;
  author: string;
  category: string;
  rating: string;
  status: string;
}

export interface MemberDashboard {
  memberCard: MemberCard | null;
  activitySummary: ActivitySummary;
  readyReservations: ReadyReservation[];
  activeLoans: ActiveLoan[];
  myTickets: MyTicket[];
  recommendedBooks: RecommendedBook[];
}

export interface VolunteerApplicationInput {
  majorOrJob: string;
  institution: string;
  division: string;
  motivation: string;
  cvDocument?: File;
}
