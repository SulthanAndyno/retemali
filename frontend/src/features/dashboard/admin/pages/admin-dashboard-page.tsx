'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAdminDashboard } from '../hooks/use-admin-dashboard';
import { useAdminToasts } from '../hooks/use-admin-toasts';
import { useVolunteerApprovals } from '../hooks/use-volunteer-approvals';
import { useShiftApprovals } from '../hooks/use-shift-approvals';
import { usePaymentAccounts } from '../hooks/use-payment-accounts';
import { useEventPaymentVerification } from '../hooks/use-event-payment-verification';
import { AdminToast } from '../components/admin-toast';
import { AdminDashboardLoading } from '../components/admin-dashboard-loading';
import { AdminDashboardError } from '../components/admin-dashboard-error';
import { AdminConsoleHeader } from '../components/admin-console-header';
import { AdminKpiGrid } from '../components/admin-kpi-grid';
import { OverdueLoansCard } from '../components/overdue-loans-card';
import { VolunteerApplicationsCard } from '../components/volunteer-applications-card';
import { ShiftVerificationCard } from '../components/shift-verification-card';
import { PaymentAccountsCard } from '../components/payment-accounts-card';
import { EventPaymentVerificationCard } from '../components/event-payment-verification-card';
import { PaymentProofModal } from '../components/payment-proof-modal';
import { ReportsNavigationCard } from '../components/reports-navigation-card';
import { AuditLogCard } from '../components/audit-log-card';
import type { PaymentAccount, VerifyEventPaymentInput } from '../types/admin.types';

export function AdminDashboardPage() {
  const router = useRouter();
  const { data, loading, error, reload, refresh } = useAdminDashboard();
  const { toasts, addToast } = useAdminToasts();
  const volunteerApprovals = useVolunteerApprovals(refresh);
  const shiftApprovals = useShiftApprovals(refresh);
  const paymentAccounts = usePaymentAccounts();
  const eventPayments = useEventPaymentVerification();

  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/login?next=%2Fdashboard%2Fadmin');
    } else if (error?.status === 403) {
      router.replace('/portal');
    }
  }, [error, router]);

  const isRedirecting = error?.status === 401 || error?.status === 403;

  const handleApproveApplication = async (id: string) => {
    const result = await volunteerApprovals.review(id, { status: 'APPROVED' });
    addToast(
      result.ok ? 'Relawan berhasil disetujui' : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleApproveShift = async (id: string) => {
    const result = await shiftApprovals.approve(id);
    addToast(
      result.ok ? 'Shift disetujui' : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleApproveAllShifts = async () => {
    const result = await shiftApprovals.approveAll();
    addToast(
      result.ok ? 'Semua shift disetujui' : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleAccountSubmit = async () => {
    const result = await paymentAccounts.submit();
    addToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleToggleAccount = async (account: PaymentAccount) => {
    const result = await paymentAccounts.toggle(account);
    addToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleDeleteAccount = async (account: PaymentAccount) => {
    const result = await paymentAccounts.remove(account);
    addToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleVerifyPayment = async (
    id: string,
    status: VerifyEventPaymentInput['status']
  ) => {
    const result = await eventPayments.verify(id, { status });
    addToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <AdminToast toasts={toasts} />

      <div className="max-w-md mx-auto pb-10">
        <Header title="Dashboard Admin" subtitle="Pusat Kendali Operasional" showBack />

        {loading || isRedirecting ? (
          <AdminDashboardLoading />
        ) : error && !data ? (
          <AdminDashboardError message={error.message} onRetry={() => void reload()} />
        ) : data ? (
          <main className="px-4 pt-5 space-y-5">
            <AdminConsoleHeader />
            <AdminKpiGrid kpis={data.kpiCards} />
            <OverdueLoansCard alerts={data.overdueCirculationAlerts} />
            <VolunteerApplicationsCard
              applications={data.pendingVolunteerApplications}
              pendingId={volunteerApprovals.pendingId}
              onApprove={handleApproveApplication}
            />
            <ShiftVerificationCard
              verification={data.shiftHoursVerification}
              pendingId={shiftApprovals.pendingId}
              approvingAll={shiftApprovals.approvingAll}
              onApprove={handleApproveShift}
              onApproveAll={handleApproveAllShifts}
            />
            <PaymentAccountsCard
              accounts={paymentAccounts.accounts}
              loading={paymentAccounts.loading}
              error={paymentAccounts.error}
              busyId={paymentAccounts.busyId}
              formOpen={paymentAccounts.formOpen}
              editingId={paymentAccounts.editingId}
              form={paymentAccounts.form}
              qrisPreview={paymentAccounts.qrisPreview}
              saving={paymentAccounts.saving}
              onReload={() => void paymentAccounts.reload()}
              onCreate={paymentAccounts.openCreate}
              onEdit={paymentAccounts.openEdit}
              onToggle={handleToggleAccount}
              onDelete={handleDeleteAccount}
              onCloseForm={paymentAccounts.closeForm}
              onFieldChange={paymentAccounts.updateField}
              onQrisFileChange={paymentAccounts.selectQrisFile}
              onSubmit={handleAccountSubmit}
            />
            <EventPaymentVerificationCard
              registrations={eventPayments.registrations}
              loading={eventPayments.loading}
              error={eventPayments.error}
              verifyingId={eventPayments.verifyingId}
              onReload={() => void eventPayments.reload()}
              onOpenProof={eventPayments.openProof}
              onVerify={handleVerifyPayment}
            />
            <ReportsNavigationCard onNavigate={(href) => router.push(href)} />
            <AuditLogCard logs={data.systemAuditLogs} loading={false} />
          </main>
        ) : null}
      </div>

      <PaymentProofModal url={eventPayments.proofPreview} onClose={eventPayments.closeProof} />
    </div>
  );
}
