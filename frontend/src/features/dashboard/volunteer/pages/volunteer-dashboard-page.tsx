'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useRole } from '@/features/auth';
import { useVolunteerDashboard } from '../hooks/use-volunteer-dashboard';
import { useShiftClock } from '../hooks/use-shift-clock';
import { useQuickCirculation } from '../hooks/use-quick-circulation';
import { useTicketCheckIn } from '../hooks/use-ticket-check-in';
import { useDonationVerification } from '../hooks/use-donation-verification';
import { useHandoverNote } from '../hooks/use-handover-note';
import { RoleSwitchCard } from '../components/role-switch-card';
import { ActiveShiftCard } from '../components/active-shift-card';
import { MetricGrid } from '../components/metric-grid';
import { QuickCirculationCard } from '../components/quick-circulation-card';
import { AttendanceCard } from '../components/attendance-card';
import { PendingDonationsCard } from '../components/pending-donations-card';
import { HandoverNoteCard } from '../components/handover-note-card';
import { VolunteerToast } from '../components/volunteer-toast';
import { VolunteerDashboardLoading } from '../components/volunteer-dashboard-loading';
import { VolunteerDashboardError } from '../components/volunteer-dashboard-error';
import { DEFAULT_SHIFT_LOCATION, DEFAULT_SHIFT_TYPE } from '../lib/volunteer-constants';
import { shiftLabel } from '../lib/volunteer-format';
import type { TodayMetrics } from '../types/volunteer.types';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const EMPTY_METRICS: TodayMetrics = {
  borrowedToday: 0,
  returnedToday: 0,
  overdueCount: 0,
  checkedInTickets: 0,
  totalEventQuota: 0,
};

export function VolunteerDashboardPage() {
  const router = useRouter();
  const {
    activeRole,
    isVolunteerMode,
    canSwitchVolunteer,
    switching: roleSwitching,
    switchRole,
  } = useRole();

  const { data, loading, error, reload, refresh } = useVolunteerDashboard();

  const activeShift = data?.activeShiftDesk.myActiveShift ?? null;
  const onDutyVolunteers = data?.activeShiftDesk.onDutyVolunteers ?? [];
  const metrics = data?.todayMetrics ?? EMPTY_METRICS;

  const [toast, setToast] = useState<ToastState>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/login?next=%2Fdashboard%2Fvolunteer');
    } else if (error?.status === 403) {
      router.replace('/portal');
    }
  }, [error, router]);

  const clock = useShiftClock(activeShift, refresh);
  const circulation = useQuickCirculation(refresh);
  const ticket = useTicketCheckIn(refresh);
  const donations = useDonationVerification(refresh);
  const note = useHandoverNote(activeShift?.shiftType ?? DEFAULT_SHIFT_TYPE);

  const handleToggleRole = async () => {
    try {
      const result = await switchRole(isVolunteerMode ? 'MEMBER' : 'VOLUNTEER');
      showToast(result?.note ?? 'Mode peran diperbarui.');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Gagal mengganti peran.',
        'error'
      );
    }
  };

  const handleToggleClock = async () => {
    const wasClockedIn = clock.isClockedIn;
    const result = await clock.toggle({ taskSummary: note.content });

    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }

    showToast(
      wasClockedIn
        ? 'Shift selesai. Clock-Out berhasil dicatat!'
        : 'Selamat bertugas! Clock-In berhasil dicatat.'
    );
  };

  const handleCirculationSubmit = async () => {
    const { tab, memberCode, bookCode } = circulation;
    const member = memberCode.trim();
    const book = bookCode.trim();
    const result = await circulation.submit();

    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }

    showToast(
      tab === 'checkout'
        ? `Peminjaman buku ${book} untuk anggota ${member} BERHASIL!`
        : `Pengembalian buku ${book} berhasil diterima!`
    );
  };

  const handleTicketSubmit = async () => {
    const code = ticket.code.trim();
    const result = await ticket.submit();

    showToast(
      result.ok
        ? `Presensi tiket ${code} berhasil diverifikasi!`
        : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleVerifyDonation = async (id: string) => {
    const donation = data?.pendingBookDonations.find((item) => item.id === id);
    const result = await donations.verify(id);

    showToast(
      result.ok
        ? `Batch donasi dari ${donation?.donorName ?? 'donatur'} telah diverifikasi & diterima!`
        : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleSaveNotes = async () => {
    const result = await note.save();

    showToast(
      result.ok
        ? 'Catatan kendala & logistik piket berhasil disimpan!'
        : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const isRedirecting = error?.status === 401 || error?.status === 403;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/60 pb-16 text-slate-800">
      <VolunteerToast toast={toast} />

      <Header title="Operasional Relawan" subtitle="Presensi & Sirkulasi Cepat" showBack />

      {loading || isRedirecting ? (
        <VolunteerDashboardLoading />
      ) : error && !data ? (
        <VolunteerDashboardError message={error.message} onRetry={() => void reload()} />
      ) : (
        <main className="px-4 pt-3 space-y-3.5">
          <RoleSwitchCard
            activeRole={activeRole}
            isVolunteerMode={isVolunteerMode}
            canSwitch={canSwitchVolunteer}
            switching={roleSwitching}
            onToggle={handleToggleRole}
          />

          <ActiveShiftCard
            shiftLabel={shiftLabel(activeShift?.shiftType)}
            location={activeShift?.location ?? DEFAULT_SHIFT_LOCATION}
            myActiveShift={activeShift}
            onDutyVolunteers={onDutyVolunteers}
            duration={clock.duration}
            isClockedIn={clock.isClockedIn}
            pending={clock.pending}
            onToggleClock={handleToggleClock}
          />

          <MetricGrid metrics={metrics} />

          <QuickCirculationCard
            tab={circulation.tab}
            memberCode={circulation.memberCode}
            bookCode={circulation.bookCode}
            pending={circulation.pending}
            onTabChange={circulation.setTab}
            onMemberCodeChange={circulation.setMemberCode}
            onBookCodeChange={circulation.setBookCode}
            onSubmit={handleCirculationSubmit}
          />

          <AttendanceCard
            event={data?.ongoingEventAttendance ?? null}
            showTicketInput={ticket.showInput}
            ticketCode={ticket.code}
            ticketPending={ticket.pending}
            onOpenTicketInput={ticket.openInput}
            onTicketCodeChange={ticket.setCode}
            onTicketSubmit={handleTicketSubmit}
          />

          <PendingDonationsCard
            donations={data?.pendingBookDonations ?? []}
            pendingId={donations.pendingId}
            onVerify={handleVerifyDonation}
          />

          <HandoverNoteCard
            content={note.content}
            tags={note.tags}
            pending={note.pending}
            onContentChange={note.setContent}
            onToggleTag={note.toggleTag}
            onSave={handleSaveNotes}
          />
        </main>
      )}
    </div>
  );
}
