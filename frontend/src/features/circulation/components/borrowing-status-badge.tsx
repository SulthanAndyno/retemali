import { formatRupiah } from '@/shared/lib/format';
import { STATUS_CLASSES, STATUS_LABELS } from '../lib/borrowing-status';
import type { LoanStatus } from '../types/circulation.types';

interface BorrowingStatusBadgeProps {
  status: LoanStatus;
  fineAmount: number;
}

export function BorrowingStatusBadge({ status, fineAmount }: BorrowingStatusBadgeProps) {
  return (
    <td className="px-2 py-2.5">
      <span
        className={`inline-block px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
          STATUS_CLASSES[status] ?? 'bg-slate-100 text-slate-600'
        }`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
      {fineAmount > 0 && (
        <p className="text-[9px] text-amber-700 font-semibold mt-1">
          Denda {formatRupiah(fineAmount)}
        </p>
      )}
    </td>
  );
}
