import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import { formatDateId } from '@/shared/lib/format';
import type { MemberLoan } from '../types/member-page.types';
import { loanHint, resolveLoanState } from '../lib/member-loans';
import { LoanStatusBadge } from './loan-status-badge';

export function LoanCard({ loan }: { loan: MemberLoan }) {
  const state = resolveLoanState(loan);

  return (
    <Card className="flex gap-4">
      {loan.book.coverImage ? (
        <Image
          src={getImageUrl(loan.book.coverImage)}
          alt={`Cover buku ${loan.book.title}`}
          width={76}
          height={108}
          className="h-27 w-19 shrink-0 rounded-field border border-surface-soft object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-27 w-19 shrink-0 items-center justify-center rounded-field bg-surface-blue/70 text-xl font-bold text-primary-deep"
        >
          {loan.book.title.charAt(0)}
        </div>
      )}
      <div className="min-w-0 space-y-1.5">
        <p className="truncate font-bold text-ink">{loan.book.title}</p>
        <p className="text-xs text-ink-soft">
          Dipinjam {formatDateId(loan.borrowedAt)} • Jatuh tempo{' '}
          {formatDateId(loan.dueDate)}
          {state.daysRemaining > 0 ? ` (sisa ${state.daysRemaining} hari)` : ''}
        </p>
        <LoanStatusBadge loan={loan} />
        <p className="text-xs text-ink-soft">{loanHint(state)}</p>
        <Link
          href={`/member/peminjaman/${loan.id}`}
          className="inline-flex items-center text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          Detail peminjaman
        </Link>
      </div>
    </Card>
  );
}
