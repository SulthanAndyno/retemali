import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Receipt,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { StatCard } from '@/shared/components/ui/card';

interface AdminStatGridProps {
  booksTotal: number;
  membersTotal: number;
  activeMembers: number;
  approvedVolunteers: number;
  pendingVolunteers: number;
  upcomingEvents: number;
  eventsTotal: number;
  registrationsTotal: number;
  pendingPaymentCount: number;
  pendingFinancialCount: number;
  pendingBookDonationCount: number;
  attendedTotal: number;
}

export function AdminStatGrid({
  booksTotal,
  membersTotal,
  activeMembers,
  approvedVolunteers,
  pendingVolunteers,
  upcomingEvents,
  eventsTotal,
  registrationsTotal,
  pendingPaymentCount,
  pendingFinancialCount,
  pendingBookDonationCount,
  attendedTotal,
}: AdminStatGridProps) {
  const pendingVerification =
    pendingPaymentCount + pendingBookDonationCount + pendingFinancialCount;

  return (
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
        label="Volunteer"
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
        icon={<ClipboardCheck className="h-5 w-5" aria-hidden />}
        hint="Dari 5 kegiatan terakhir"
      />
    </div>
  );
}
