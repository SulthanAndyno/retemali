import { Clock, Undo2 } from 'lucide-react';
import { formatDateId } from '@/shared/lib/format';
import type { BorrowingRow } from '../types/circulation.types';

interface BorrowingDueCellProps {
  row: BorrowingRow;
}

export function BorrowingDueCell({ row }: BorrowingDueCellProps) {
  return (
    <td className="px-2 py-2.5 whitespace-nowrap">
      <p className="text-slate-600">{formatDateId(row.dueDate)}</p>
      {row.isOverdue ? (
        <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold">
          <Clock size={9} /> +{row.overdueDays} hari
        </span>
      ) : row.status === 'RETURNED' && row.returnedAt ? (
        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
          <Undo2 size={9} /> {formatDateId(row.returnedAt)}
        </span>
      ) : (
        <span className="text-slate-400">{row.daysUntilDue} hari lagi</span>
      )}
    </td>
  );
}
