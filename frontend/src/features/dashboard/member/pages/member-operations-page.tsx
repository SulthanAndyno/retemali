'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useMemberDashboard } from '../hooks/use-member-dashboard';
import { useMemberActions } from '../hooks/use-member-actions';
import { useVolunteerApplication } from '../hooks/use-volunteer-application';
import { MemberCard } from '../components/member-card';
import { MemberSection } from '../components/member-section';
import { LoanList } from '../components/loan-list';
import { ReservationList } from '../components/reservation-list';
import { TicketList } from '../components/ticket-list';
import { VolunteerCta } from '../components/volunteer-cta';
import { VolunteerApplyModal } from '../components/volunteer-apply-modal';
import { MemberToast } from '../components/member-toast';
import { MemberDashboardLoading } from '../components/member-dashboard-loading';
import { MemberDashboardError } from '../components/member-dashboard-error';

type ToastState = { message: string; type: 'success' | 'error' } | null;

export function MemberOperationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data, loading, error, reload, refresh } = useMemberDashboard();
  const actions = useMemberActions(refresh);

  const [showApplyModal, setShowApplyModal] = useState(false);
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

  // Sesi habis / role tidak sesuai: proxy menangani navigasi berikutnya.
  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/login?next=%2Fmember');
    } else if (error?.status === 403) {
      router.replace('/portal');
    }
  }, [error, router]);

  const handleApplySuccess = useCallback(() => {
    setShowApplyModal(false);
  }, []);

  const volunteer = useVolunteerApplication(handleApplySuccess);

  const handleExtendLoan = async (loanId: string) => {
    const result = await actions.extendLoan(loanId);
    showToast(
      result.ok ? 'Masa pinjam berhasil diperpanjang +7 Hari!' : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleCancelReservation = async (reservationId: string) => {
    const result = await actions.cancelReservation(reservationId);
    showToast(
      result.ok ? 'Reservasi berhasil dibatalkan' : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const handleApplyVolunteer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await volunteer.submit();
    showToast(
      result.ok
        ? 'Pendaftaran relawan berhasil dikirim! Menunggu persetujuan admin.'
        : result.message,
      result.ok ? 'success' : 'error'
    );
  };

  const isRedirecting = error?.status === 401 || error?.status === 403;

  return (
    <div className="space-y-4 text-slate-800">
      <MemberToast toast={toast} />

      {loading || isRedirecting ? (
        <MemberDashboardLoading />
      ) : error && !data ? (
        <MemberDashboardError message={error.message} onRetry={() => void reload()} />
      ) : (
        <div className="space-y-4">
          <MemberCard
            member={data?.memberCard ?? null}
            fallback={{
              name: user?.name,
              memberCode: user?.memberCode,
              points: user?.points,
              readingTarget: user?.readingTarget,
            }}
          />

          <MemberSection
            icon={<BookOpen size={16} className="text-blue-600" />}
            title="Pinjaman Buku Aktif"
            badge={{
              text: `${data?.activitySummary.activeLoansCount ?? 0} Buku`,
              className: 'text-blue-700 bg-blue-50',
            }}
          >
            <LoanList
              loans={data?.activeLoans ?? []}
              pendingId={actions.pendingId}
              onExtend={handleExtendLoan}
            />
          </MemberSection>

          <MemberSection
            icon={<Clock size={16} className="text-amber-500" />}
            title="Reservasi Siap Ambil"
            badge={{
              text: `${data?.activitySummary.readyPickupCount ?? 0} Reservasi`,
              className: 'text-amber-700 bg-amber-50',
            }}
          >
            <ReservationList
              reservations={data?.readyReservations ?? []}
              pendingId={actions.pendingId}
              onCancel={handleCancelReservation}
            />
          </MemberSection>

          <MemberSection
            icon={<Calendar size={16} className="text-blue-600" />}
            title="E-Tiket Kegiatan Komunitas"
          >
            <TicketList tickets={data?.myTickets ?? []} />
          </MemberSection>

          <VolunteerCta onOpen={() => setShowApplyModal(true)} />
        </div>
      )}

      <VolunteerApplyModal
        open={showApplyModal}
        values={volunteer.values}
        pending={volunteer.pending}
        onClose={() => setShowApplyModal(false)}
        onChange={volunteer.setField}
        onSubmit={handleApplyVolunteer}
      />

    </div>
  );
}
