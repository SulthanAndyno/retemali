import { formatDateId } from '@/shared/lib/format';
import type { BorrowingRow } from '../types/circulation.types';
import { BorrowingDueCell } from './borrowing-due-cell';
import { BorrowingStatusBadge } from './borrowing-status-badge';

interface BorrowingTableRowProps {
  row: BorrowingRow;
}

export function BorrowingTableRow({ row }: BorrowingTableRowProps) {
  return (
    <tr className="border-t border-slate-100 align-top">
      <td className="px-3 py-2.5">
        <p className="font-bold text-slate-800">{row.member.name}</p>
        <p className="text-slate-500 font-mono">{row.member.memberCode}</p>
        {row.member.rtRw && <p className="text-slate-400">{row.member.rtRw}</p>}
      </td>
      <td className="px-2 py-2.5 max-w-[120px]">
        <p className="font-semibold text-slate-800 line-clamp-2">{row.book.title}</p>
        <p className="text-slate-500 font-mono">{row.book.bookCode}</p>
      </td>
      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">
        {formatDateId(row.borrowedAt)}
        {row.extendedCount > 0 && (
          <span className="block text-[9px] text-blue-600 font-semibold">
            +{row.extendedCount}x perpanjang
          </span>
        )}
      </td>
      <BorrowingDueCell row={row} />
      <BorrowingStatusBadge status={row.status} fineAmount={row.fineAmount} />
      <td className="px-3 py-2.5 text-right">
        <p className="text-[8px] text-slate-400 mt-1 font-mono">{row.loanCode}</p>
      </td>
    </tr>
  );
}
