import type { PaginatedMeta } from '@/shared/types/api';

export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type BorrowingStatusFilter = 'ALL' | LoanStatus;

export interface BorrowingRow {
  id: string;
  loanCode: string;
  status: LoanStatus;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  extendedCount: number;
  fineAmount: number;
  overdueDays: number;
  daysUntilDue: number;
  isOverdue: boolean;
  member: {
    memberCode: string;
    name: string;
    rtRw: string | null;
  };
  book: {
    bookCode: string;
    title: string;
  };
}

export interface BorrowingsPageSummary {
  total: number;
  active: number;
  overdue: number;
  returned: number;
  fines: number;
}

export interface BorrowingsResponse {
  rows: BorrowingRow[];
  meta: PaginatedMeta;
  pageSummary: BorrowingsPageSummary;
  fetchedAt: string;
}

export interface BorrowingsQuery {
  page: number;
  status: BorrowingStatusFilter;
  search: string;
}

export interface BorrowingsError {
  message: string;
  status: number;
}

export interface UpstreamLoan {
  id: string;
  loanCode: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  extendedCount: number;
  fineAmount: string | number | null;
  status: LoanStatus;
  notes: string | null;
  user?: {
    memberCode: string;
    name: string;
    rtRw?: string | null;
  } | null;
  book?: {
    bookCode: string;
    title: string;
  } | null;
}
