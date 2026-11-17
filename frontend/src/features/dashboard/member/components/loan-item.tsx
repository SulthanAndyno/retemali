'use client';

import { Clock, RotateCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ActiveLoan } from '../types/member.types';

interface LoanItemProps {
  loan: ActiveLoan;
  pending: boolean;
  onExtend: (loanId: string) => void;
}

export function LoanItem({ loan, pending, onExtend }: LoanItemProps) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start justify-between gap-3">
      <div className="space-y-0.5">
        <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono font-bold">
          {loan.loanCode}
        </span>
        <h4 className="text-xs font-bold text-slate-900 leading-tight">{loan.book?.title}</h4>
        <p className="text-[11px] text-slate-500">{loan.book?.author}</p>
        <p className="text-[10px] text-slate-600 pt-1 flex items-center gap-1">
          <Clock size={11} className="text-amber-500" />
          <span>Jatuh Tempo: {formatDate(loan.dueDate)}</span>
        </p>
      </div>

      <button
        onClick={() => onExtend(loan.id)}
        disabled={pending}
        className="px-2.5 py-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-[11px] font-bold shadow-xs shrink-0 flex items-center gap-1 disabled:opacity-50"
      >
        <RotateCw size={11} /> +7 Hari
      </button>
    </div>
  );
}
