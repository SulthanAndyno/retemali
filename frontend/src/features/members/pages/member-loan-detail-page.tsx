'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import { formatDateId } from '@/shared/lib/format';
import { useMemberLoans } from '../hooks/use-member-loans';
import { loanHint, resolveLoanState } from '../lib/member-loans';
import { EmptyState } from '../components/empty-state';

export function MemberLoanDetailPage({ loanId }: { loanId: string }) {
  const { loans, loading, error, reload } = useMemberLoans();
  const loan = loans.find((entry) => entry.id === loanId);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-card bg-white" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
        <p className="text-sm text-danger">{error}</p>
        <Button size="sm" variant="danger" onClick={() => void reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Detail Peminjaman" />
        <EmptyState
          title="Peminjaman tidak ditemukan"
          description="Catatan peminjaman dengan nomor tersebut bukan pinjaman Anda atau tidak ada."
        />
        <Link
          href="/member/peminjaman"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke Peminjaman Saya
        </Link>
      </div>
    );
  }

  const state = resolveLoanState(loan);
  const book = loan.book;

  return (
    <div className="w-full space-y-6">
      <Link
        href="/member/peminjaman"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke Peminjaman Saya
      </Link>

      <Card className="flex flex-wrap gap-5">
        {book.coverImage ? (
          <Image
            src={getImageUrl(book.coverImage)}
            alt={`Cover buku ${book.title}`}
            width={120}
            height={172}
            className="h-43 w-30 shrink-0 rounded-field border border-surface-soft object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-43 w-30 shrink-0 items-center justify-center rounded-field bg-surface-blue/70 text-3xl font-bold text-primary-deep"
          >
            {book.title.charAt(0)}
          </div>
        )}
        <div className="min-w-60 flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            ID Peminjaman{' '}
            <span className="font-mono text-ink">{loan.id}</span>
          </p>
          <h1 className="text-lg font-bold text-ink">{book.title}</h1>
          <p className="text-sm text-ink-soft">
            Penulis: {book.author} • {book.publicationYear ?? '-'}
          </p>
          <Badge tone={state.tone}>
            {state.label.charAt(0).toUpperCase() + state.label.slice(1)}
          </Badge>
          <dl className="space-y-1.5 pt-1 text-sm text-ink-soft">
            <div>
              <dt className="inline font-semibold text-ink">Tanggal pinjam: </dt>
              <dd className="inline">{formatDateId(loan.borrowedAt)}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-ink">Jatuh tempo: </dt>
              <dd className="inline">
                {formatDateId(loan.dueDate)}
                {state.daysRemaining > 0
                  ? ` (sisa ${state.daysRemaining} hari)`
                  : state.daysRemaining < 0
                    ? ` (melewati ${Math.abs(state.daysRemaining)} hari)`
                    : ''}
              </dd>
            </div>
            {loan.returnedAt ? (
              <div>
                <dt className="inline font-semibold text-ink">
                  Tanggal kembali:{' '}
                </dt>
                <dd className="inline">{formatDateId(loan.returnedAt)}</dd>
              </div>
            ) : null}
            <div>
              <dt className="inline font-semibold text-ink">
                Ketersediaan koleksi:{' '}
              </dt>
              <dd className="inline">
                {book.availableStock ?? '-'}/{book.totalStock ?? '-'} salinan
                tersedia
              </dd>
            </div>
          </dl>
        </div>
      </Card>

      {book.synopsis ? (
        <Card>
          <h2 className="text-base font-bold text-ink">Sinopsis</h2>
          <p className="mt-1 text-sm text-ink-soft">{book.synopsis}</p>
        </Card>
      ) : null}

      <Card className="flex items-start gap-2.5 bg-surface-blue/50">
        <ListChecks
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">{loanHint(state)}</p>
      </Card>
    </div>
  );
}
