import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  QrCode,
  Receipt,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { StatCard } from '@/components/ui/card';
import { DummyNotice } from '@/features/admin';
import {
  DUMMY_MEMBERS,
  DUMMY_PENDING_PAYMENTS,
} from '@/features/admin';

interface AdminStatGridProps {
  booksTotal: number;
  approvedVolunteers: number;
  pendingVolunteers: number;
  upcomingEvents: number;
  eventsTotal: number;
  registrationsTotal: number;
  pendingPaymentCount: number;
  pendingBookDonationCount: number;
  attendedTotal: number;
}

export function AdminStatGrid({
  booksTotal,
  approvedVolunteers,
  pendingVolunteers,
  upcomingEvents,
  eventsTotal,
  registrationsTotal,
  pendingPaymentCount,
  pendingBookDonationCount,
  attendedTotal,
}: AdminStatGridProps) {
  const membersTotal = DUMMY_MEMBERS.length;
  const activeMembers = DUMMY_MEMBERS.filter(
    (member) => member.membershipStatus === 'active'
  ).length;
  const dummyPendingPayments = DUMMY_PENDING_PAYMENTS.filter(
    (payment) => payment.status === 'pending'
  ).length;
  const pendingVerification =
    pendingPaymentCount + pendingBookDonationCount + dummyPendingPayments;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard
          label="Buku Katalog"
          value={booksTotal}
          icon={<BookOpen className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label="Member"
          value={membersTotal}
          icon={<UserRound className="h-5 w-5" aria-hidden />}
          hint={`${activeMembers} aktif`}
        />
        <StatCard
          label="Relawan"
          value={approvedVolunteers}
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          hint={`${pendingVolunteers} menunggu persetujuan`}
        />
        <StatCard
          label="Kegiatan Mendatang"
          value={upcomingEvents}
          icon={<CalendarDays className="h-5 w-5" aria-hidden />}
          hint={`${eventsTotal} total`}
        />
        <StatCard
          label="Total Pendaftaran"
          value={registrationsTotal}
          icon={<ClipboardList className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label="Verifikasi Tertunda"
          value={pendingVerification}
          icon={<Receipt className="h-5 w-5" aria-hidden />}
          hint={`${pendingBookDonationCount} donasi buku`}
        />
        <StatCard
          label="Check-in Tercatat"
          value={attendedTotal}
          icon={<QrCode className="h-5 w-5" aria-hidden />}
          hint="Dari 5 kegiatan terakhir"
        />
      </div>
      <DummyNotice />
    </div>
  );
}
