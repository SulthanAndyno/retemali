'use client';

import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { useMemberLoans } from '../hooks/use-member-loans';
import { isActiveLoan } from '../lib/member-loans';
import { EmptyState } from '../components/empty-state';
import { LoanCard } from '../components/loan-card';
import { LoanHistoryTable } from '../components/loan-history-table';

export function MemberLoansPage() {
  const { loans, loading, error, reload } = useMemberLoans();

  const active = loans.filter(isActiveLoan);
  const history = loans.filter((loan) => loan.status === 'RETURNED');

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Peminjaman Saya"
        description="Status dihitung dari record peminjaman dan tanggal jatuh tempo."
      />

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{error}</p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 text-base font-bold text-ink">Sedang Dipinjam</h2>
        {loading ? (
          <div className="h-40 animate-pulse rounded-card bg-white" />
        ) : active.length === 0 ? (
          <EmptyState
            title="Tidak ada buku yang sedang dipinjam"
            description="Cari koleksi di Katalog Buku, lalu ajukan peminjaman melalui petugas di taman baca."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-ink">
          Riwayat Peminjaman
        </h2>
        {loading ? (
          <div className="h-40 animate-pulse rounded-card bg-white" />
        ) : history.length === 0 ? (
          <EmptyState title="Belum ada riwayat pengembalian" />
        ) : (
          <LoanHistoryTable loans={history} />
        )}
      </section>
    </div>
  );
}
