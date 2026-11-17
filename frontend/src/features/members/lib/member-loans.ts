import type { MemberLoan } from '../types/member-page.types';

const DAY_MS = 24 * 60 * 60 * 1000;

export type LoanStateKey = 'active' | 'due-soon' | 'overdue' | 'returned' | 'lost';

export interface LoanState {
  key: LoanStateKey;
  label: string;
  tone: 'info' | 'warning' | 'danger' | 'neutral';
  daysRemaining: number;
}

export function resolveLoanState(
  loan: MemberLoan,
  now = Date.now()
): LoanState {
  if (loan.status === 'RETURNED') {
    return {
      key: 'returned',
      label: 'Sudah dikembalikan',
      tone: 'neutral',
      daysRemaining: 0,
    };
  }

  if (loan.status === 'LOST') {
    return {
      key: 'lost',
      label: 'Buku hilang',
      tone: 'danger',
      daysRemaining: 0,
    };
  }

  const due = new Date(loan.dueDate).getTime();
  const daysRemaining = Math.ceil((due - now) / DAY_MS);

  if (loan.status === 'OVERDUE' || due < now) {
    return {
      key: 'overdue',
      label: 'Terlambat',
      tone: 'danger',
      daysRemaining,
    };
  }

  if (daysRemaining <= 3) {
    return {
      key: 'due-soon',
      label: 'Mendekati tenggat',
      tone: 'warning',
      daysRemaining,
    };
  }

  return { key: 'active', label: 'Aktif', tone: 'info', daysRemaining };
}

export function isActiveLoan(loan: MemberLoan): boolean {
  return loan.status === 'BORROWED' || loan.status === 'OVERDUE';
}

export function loanHint(state: LoanState): string {
  if (state.key === 'overdue') {
    return 'Jatuh tempo terlewat — selesaikan pengembalian di meja petugas agar status pinjaman tidak terus menunggak.';
  }
  if (state.key === 'due-soon') {
    return 'Kembalikan buku ke meja petugas sebelum jatuh tempo; perpanjangan diajukan langsung ke petugas di lokasi.';
  }
  if (state.key === 'returned') {
    return 'Buku telah diterima petugas dan catatan ini tertutup.';
  }
  if (state.key === 'lost') {
    return 'Buku ditandai hilang. Hubungi pengelola untuk penyelesaian administrasi.';
  }
  return 'Masih dalam masa pinjam. Kembalikan di meja petugas paling lambat jatuh tempo.';
}
