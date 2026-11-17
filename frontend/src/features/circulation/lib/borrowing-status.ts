import type { BorrowingStatusFilter, LoanStatus } from '../types/circulation.types';

export const STATUS_TABS: readonly { id: BorrowingStatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  { id: 'BORROWED', label: 'Dipinjam' },
  { id: 'OVERDUE', label: 'Terlambat' },
  { id: 'RETURNED', label: 'Kembali' },
  { id: 'LOST', label: 'Hilang' },
];

export const STATUS_CLASSES: Record<LoanStatus, string> = {
  BORROWED: 'bg-blue-100 text-blue-700',
  RETURNED: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
  LOST: 'bg-slate-800 text-white',
};

export const STATUS_LABELS: Record<LoanStatus, string> = {
  BORROWED: 'Dipinjam',
  RETURNED: 'Dikembalikan',
  OVERDUE: 'Terlambat',
  LOST: 'Hilang',
};
