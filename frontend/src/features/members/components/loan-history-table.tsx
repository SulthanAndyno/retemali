import Link from 'next/link';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { formatDateId } from '@/shared/lib/format';
import type { MemberLoan } from '../types/member-page.types';

export function LoanHistoryTable({ loans }: { loans: MemberLoan[] }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Buku</TH>
          <TH>Dipinjam</TH>
          <TH>Jatuh Tempo</TH>
          <TH>Dikembalikan</TH>
          <TH>Detail</TH>
        </TR>
      </THead>
      <TBody>
        {loans.map((loan) => (
          <TR key={loan.id}>
            <TD>{loan.book.title}</TD>
            <TD>{formatDateId(loan.borrowedAt)}</TD>
            <TD>{formatDateId(loan.dueDate)}</TD>
            <TD>{formatDateId(loan.returnedAt)}</TD>
            <TD>
              <Link
                href={`/member/peminjaman/${loan.id}`}
                className="text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
              >
                Detail
              </Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
