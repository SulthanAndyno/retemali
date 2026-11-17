'use client';

import { Receipt } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';
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
  const { data, loading } = useAdminOverview();

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
