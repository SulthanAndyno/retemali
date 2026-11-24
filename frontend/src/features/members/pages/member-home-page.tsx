'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, ClipboardCheck, MapPin, Wallet } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { Card, SectionTitle, StatCard } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { useNotifications } from '@/features/notifications';
import { useAuth } from '@/features/auth';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import { useMemberHome } from '../hooks/use-member-home';
import { useNow } from '../hooks/use-now';
import { isActiveLoan, resolveLoanState } from '../lib/member-loans';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { LoanStatusBadge } from '../components/loan-status-badge';
import { MemberProfileCard } from '../components/member-profile-card';

function startOfToday(): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function paymentLabel(paymentStatus: string | null): {
  label: string;
  tone: 'success' | 'warning' | 'danger';
} {
  if (paymentStatus === 'VERIFIED') {
    return { label: 'Terverifikasi', tone: 'success' };
  }
  if (paymentStatus === 'FAILED') {
    return { label: 'Gagal', tone: 'danger' };
  }
  if (paymentStatus === 'PENDING') {
    return { label: 'Menunggu verifikasi admin', tone: 'warning' };
  }
  return { label: 'Gratis — terkonfirmasi', tone: 'success' };
}

export function MemberHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { data, loading, failedSources, authStatus, reload } = useMemberHome();
  const now = useNow();

  useEffect(() => {
    if (authStatus === 401) {
      router.replace('/login?next=%2Fmember');
    } else if (authStatus === 403) {
      router.replace('/portal');
    }
  }, [authStatus, router]);

  if (!user) {
    return <p className="text-sm text-ink-soft">Memuat profil member…</p>;
  }

  const activeLoans = data.loans.filter(isActiveLoan);
  const overdueLoans =
    now === null
      ? []
      : activeLoans.filter(
          (loan) => resolveLoanState(loan, now).key === 'overdue'
        );
  const returnedLoans = data.loans.filter((loan) => loan.status === 'RETURNED');
  const dueSoonLoans = activeLoans
    .filter(
      (loan) => now === null || resolveLoanState(loan, now).key !== 'overdue'
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const displayedLoans = overdueLoans.length > 0 ? activeLoans : dueSoonLoans;

  const recentTickets = [...data.tickets]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);
  const pendingPaymentCount = data.tickets.filter(
    (ticket) => ticket.paymentStatus === 'PENDING'
  ).length;
  const attendedCount = data.tickets.filter(
    (ticket) => ticket.status === 'CHECKED_IN'
  ).length;

  const upcomingEvents = data.events
    .filter(
      (event) =>
        event.status === 'PUBLISHED' &&
        new Date(event.eventDate).getTime() >= startOfToday()
    )
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 3);

  const active = user.status === 'ACTIVE';

  return (
    <div className="space-y-8">
      <MemberProfileCard
        name={user.name}
        memberCode={user.memberCode}
        email={user.email}
        active={active}
        points={user.points}
        readingTarget={user.readingTarget}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Sedang dipinjam" value={activeLoans.length} />
        <StatCard label="Terlambat" value={overdueLoans.length} />
        <StatCard label="Sudah dikembalikan" value={returnedLoans.length} />
        <StatCard
          label="Kegiatan diikuti"
          value={data.tickets.length}
          hint={
            pendingPaymentCount > 0
              ? `${pendingPaymentCount} menunggu verifikasi pembayaran`
              : undefined
          }
        />
        <StatCard
          label="Kehadiran tercatat"
          value={attendedCount}
          icon={<ClipboardCheck className="h-5 w-5" aria-hidden />}
          hint="Check-in E-Tiket kegiatan"
        />
        <StatCard
          label="Notifikasi belum dibaca"
          value={unreadCount}
          hint="Pesan pembayaran, pengingat, dan pengumuman"
        />
      </div>

      {failedSources.length > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">
            Sebagian data gagal dimuat: {failedSources.join(', ')}.
          </p>
          <Button variant="secondary" size="sm" onClick={() => void reload()}>
            Muat Ulang
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <LinkButton href="/member/kegiatan" variant="secondary" size="sm">
          <CalendarDays className="h-4 w-4" aria-hidden />
          Lihat E-Tiket Kegiatan
        </LinkButton>
        <LinkButton href="/member/notifikasi" variant="ghost" size="sm">
          Buka Notifikasi
        </LinkButton>
      </div>

      <section>
        <SectionTitle
          title="Mendekati Tenggat"
          description="Pinjaman aktif dengan jatuh tempo terdekat, termasuk yang melewati tenggat."
        />
        {loading ? (
          <div className="h-40 animate-pulse rounded-card bg-white" />
        ) : activeLoans.length === 0 ? (
          <EmptyState
            title="Tidak ada pinjaman aktif"
            description="Telusuri katalog dan ajukan peminjaman melalui petugas."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Buku</TH>
                <TH>Dipinjam</TH>
                <TH>Jatuh Tempo</TH>
                <TH>Status</TH>
                <TH>Detail</TH>
              </TR>
            </THead>
            <TBody>
              {displayedLoans.map((loan) => (
                <TR key={loan.id}>
                  <TD>{loan.book.title}</TD>
                  <TD>{formatDateId(loan.borrowedAt)}</TD>
                  <TD>{formatDateId(loan.dueDate)}</TD>
                  <TD>
                    <LoanStatusBadge loan={loan} now={now ?? undefined} />
                  </TD>
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
        )}
        <div className="mt-3">
          <LinkButton href="/member/peminjaman" variant="secondary" size="sm">
            Lihat semua peminjaman
          </LinkButton>
        </div>
      </section>

      <section>
        <SectionTitle
          title="Kegiatan Saya (Terbaru)"
          description="Tiga pendaftaran terakhir beserta status pembayarannya."
        />
        {loading ? (
          <div className="h-40 animate-pulse rounded-card bg-white" />
        ) : recentTickets.length === 0 ? (
          <EmptyState
            title="Belum terdaftar kegiatan"
            description="Telusuri Kegiatan Komunitas untuk mendaftar."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Referensi</TH>
                <TH>Kegiatan</TH>
                <TH>Pembayaran</TH>
              </TR>
            </THead>
            <TBody>
              {recentTickets.map((ticket) => {
                const payment = paymentLabel(ticket.paymentStatus);
                return (
                  <TR key={ticket.id}>
                    <TD className="font-mono text-xs">{ticket.ticketCode}</TD>
                    <TD>{ticket.event.title}</TD>
                    <TD>
                      <Badge tone={payment.tone}>{payment.label}</Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
        <div className="mt-3">
          <LinkButton href="/member/kegiatan" variant="secondary" size="sm">
            Menu Kegiatan Saya
          </LinkButton>
        </div>
      </section>

      <section>
        <SectionTitle
          title="Aktivitas Terbaru"
          description="Kegiatan komunitas mendatang; terbuka untuk pendaftaran."
        />
        {upcomingEvents.length === 0 ? (
          <EmptyState title="Belum ada kegiatan mendatang" />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="space-y-2">
                <p className="font-bold text-ink">{event.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {formatDateId(event.eventDate)} • {event.startTime}–
                  {event.endTime} WIB
                </p>
                <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {event.location}
                </p>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-deep">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                  {Number(event.ticketPrice) > 0
                    ? `Tiket Masuk ${formatRupiah(Number(event.ticketPrice))}`
                    : 'Gratis'}
                </p>
                <Link
                  href="/kegiatan"
                  className="inline-flex items-center text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
                >
                  Lihat Kegiatan
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
