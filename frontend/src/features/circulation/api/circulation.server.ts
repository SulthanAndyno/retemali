import 'server-only';
import { upstreamRequest } from '@/shared/lib/server-upstream';
import { toNumber } from '@/shared/lib/format';
import {
  BORROWINGS_PAGE_SIZE,
  buildBorrowingsParams,
} from '../lib/borrowing-query';
import type {
  BorrowingsQuery,
  BorrowingsResponse,
  BorrowingRow,
  UpstreamLoan,
} from '../types/circulation.types';
import type { PaginatedMeta } from '@/shared/types/api';

const DAY_MS = 24 * 60 * 60 * 1000;

export type LoadBorrowingsResult =
  | { ok: true; data: BorrowingsResponse }
  | { ok: false; status: number; error: string };

function mapRow(loan: UpstreamLoan, now: number): BorrowingRow {
  const due = new Date(loan.dueDate);
  const dueTime = Number.isNaN(due.getTime()) ? null : due.getTime();
  const isReturned = loan.status === 'RETURNED';
  const overdueDays =
    !isReturned && dueTime !== null
      ? Math.max(0, Math.floor((now - dueTime) / DAY_MS))
      : 0;
  const daysUntilDue =
    !isReturned && dueTime !== null
      ? Math.max(0, Math.ceil((dueTime - now) / DAY_MS))
      : 0;

  return {
    id: loan.id,
    loanCode: loan.loanCode,
    status: loan.status,
    borrowedAt: loan.borrowedAt,
    dueDate: loan.dueDate,
    returnedAt: loan.returnedAt,
    extendedCount: loan.extendedCount ?? 0,
    fineAmount: toNumber(loan.fineAmount),
    overdueDays,
    daysUntilDue,
    isOverdue: !isReturned && overdueDays > 0,
    member: {
      memberCode: loan.user?.memberCode ?? '-',
      name: loan.user?.name ?? '-',
      rtRw: loan.user?.rtRw ?? null,
    },
    book: {
      bookCode: loan.book?.bookCode ?? '-',
      title: loan.book?.title ?? '-',
    },
  };
}

export async function loadBorrowings(
  token: string,
  query: BorrowingsQuery
): Promise<LoadBorrowingsResult> {
  const params = buildBorrowingsParams(query);
  const upstream = await upstreamRequest<{ data: UpstreamLoan[]; meta: PaginatedMeta }>(
    `/circulation/loans?${params.toString()}`,
    { token }
  );

  if (!upstream.ok) {
    return {
      ok: false,
      status: upstream.status || 502,
      error: upstream.error ?? 'Gagal memuat log peminjaman buku.',
    };
  }

  const now = Date.now();
  const rows = (upstream.data?.data ?? []).map((loan) => mapRow(loan, now));
  const meta: PaginatedMeta = upstream.data?.meta ?? {
    total: rows.length,
    page: query.page,
    limit: BORROWINGS_PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const pageSummary = rows.reduce(
    (acc, row) => {
      acc.total += 1;
      if (row.status === 'RETURNED') acc.returned += 1;
      else if (row.isOverdue) acc.overdue += 1;
      else acc.active += 1;
      acc.fines += row.fineAmount;
      return acc;
    },
    { total: 0, active: 0, overdue: 0, returned: 0, fines: 0 }
  );

  return {
    ok: true,
    data: { rows, meta, pageSummary, fetchedAt: new Date().toISOString() },
  };
}
