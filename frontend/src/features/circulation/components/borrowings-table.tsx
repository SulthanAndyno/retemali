import type { BorrowingRow } from '../types/circulation.types';
import { BorrowingTableRow } from './borrowing-table-row';

interface BorrowingsTableProps {
  rows: BorrowingRow[];
}

export function BorrowingsTable({ rows }: BorrowingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[10px]">
        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 font-bold">Anggota</th>
            <th className="px-2 py-2 font-bold">Buku</th>
            <th className="px-2 py-2 font-bold">Pinjam</th>
            <th className="px-2 py-2 font-bold">Jatuh Tempo</th>
            <th className="px-2 py-2 font-bold">Status</th>
            <th className="px-3 py-2 font-bold text-right">Kode Pinjam</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <BorrowingTableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
