import { LoanItem } from './loan-item';
import type { ActiveLoan } from '../types/member.types';

interface LoanListProps {
  loans: ActiveLoan[];
  pendingId: string | null;
  onExtend: (loanId: string) => void;
}

export function LoanList({ loans, pendingId, onExtend }: LoanListProps) {
  if (loans.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-2 text-center">
        Tidak ada buku yang sedang dipinjam saat ini.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {loans.map((loan) => (
        <LoanItem
          key={loan.id}
          loan={loan}
          pending={pendingId === loan.id}
          onExtend={onExtend}
        />
      ))}
    </div>
  );
}
