'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { useAdminOverview } from '../hooks/use-admin-overview';
import { AdminStatGrid } from '../components/admin-stat-grid';
import { AdminPendingPaymentsTable } from '../components/admin-pending-payments-table';
import { AdminAttendanceTable } from '../components/admin-attendance-table';
import { AdminActivityFeed } from '../components/admin-activity-feed';
import { AdminPendingApprovals } from '../components/admin-pending-approvals';
import { AdminVolunteerTable } from '../components/admin-volunteer-table';
import { AdminDonationStatusTable } from '../components/admin-donation-status-table';

export function AdminDashboardPage() {
  const router = useRouter();
  const { data, loading, failedSources, authStatus, reload } = useAdminOverview();

  useEffect(() => {
    if (authStatus === 401) {
      router.replace('/login?next=%2Fadmin');
    } else if (authStatus === 403) {
      router.replace('/portal');
    }
  }, [authStatus, router]);

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Ringkasan Operasional"
        description="Data backend real; bagian yang belum tersedia memakai data contoh."
        action={
          <LinkButton href="/admin/pembayaran" size="sm" variant="secondary">
            <Receipt className="h-4 w-4" aria-hidden />
            Buka Verifikasi
          </LinkButton>
        }
      />

      {failedSources.length > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">
            Sebagian data gagal dimuat: {failedSources.join(', ')}.
          </p>
          <Button size="sm" variant="secondary" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : null}

      <AdminStatGrid
        booksTotal={data.booksTotal}
        approvedVolunteers={data.approvedVolunteerCount}
        pendingVolunteers={data.pendingVolunteerCount}
        upcomingEvents={data.upcomingEvents}
        eventsTotal={data.eventsTotal}
        registrationsTotal={data.registrationsTotal}
        pendingPaymentCount={data.pendingPaymentCount}
        pendingBookDonationCount={data.pendingBookDonationCount}
        attendedTotal={data.attendedTotal}
      />

      <AdminPendingPaymentsTable rows={data.pendingPayments} loading={loading} />

      <AdminAttendanceTable rows={data.attendance} loading={loading} />

      <AdminActivityFeed logs={data.auditLogs} loading={loading} />

      <AdminPendingApprovals
        pendingBookDonations={data.pendingBookDonationCount}
        pendingVolunteers={data.pendingVolunteerCount}
        loading={loading}
      />

      <AdminVolunteerTable applications={data.applications} loading={loading} />

      <AdminDonationStatusTable
        bookDonations={data.pendingBookDonations}
        loading={loading}
      />
    </div>
  );
}
