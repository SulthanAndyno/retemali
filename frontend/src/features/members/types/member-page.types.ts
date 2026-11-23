export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type TicketStatus = 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export interface MemberBook {
  id: string;
  bookCode: string;
  title: string;
  author: string;
  coverImage?: string | null;
  publicationYear?: number | null;
  synopsis?: string | null;
  shelfLocation?: string | null;
  totalStock?: number;
  availableStock?: number;
}

export interface MemberLoan {
  id: string;
  loanCode: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  extendedCount: number;
  fineAmount: string;
  status: LoanStatus;
  book: MemberBook;
}

export interface MemberEvent {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  feeType: string;
  ticketPrice: string;
  category?: string;
  description?: string;
  bannerImage?: string | null;
  quota?: number;
  registeredCount?: number;
}

export interface MemberTicket {
  id: string;
  ticketCode: string;
  eventId: string;
  status: TicketStatus;
  paymentStatus: PaymentStatus | null;
  paymentNote: string | null;
  createdAt: string;
  event: MemberEvent;
}

export interface MemberAttendanceRecord {
  id: string;
  title: string;
  scannedAt: string;
}

export interface MemberQrToken {
  token: string;
  active: boolean;
  expiresAt: string;
}
