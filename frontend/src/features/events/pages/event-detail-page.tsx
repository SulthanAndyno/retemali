'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/features/auth';
import { getImageUrl } from '@/lib/utils';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import { useEventDetail } from '../hooks/use-event-detail';
import { useEventRegistration } from '../hooks/use-event-registration';
import {
  computeEventTimeline,
  computeQuotaState,
  getRegistrationGate,
} from '../lib/events';
import { PublicEmptyState } from '@/features/books';
import { EventRegisterButton } from '../components/event-register-button';
import { PaidRegistrationModal } from '../components/paid-registration-modal';

export function EventDetailPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { event, loading, error, reload } = useEventDetail(eventId);
  const [registered, setRegistered] = useState(false);

  const registration = useEventRegistration({
    loggedIn: Boolean(user),
    onRequireLogin: () =>
      router.push(`/login?next=${encodeURIComponent(`/kegiatan/${eventId}`)}`),
    onRegistered: () => {
      setRegistered(true);
      void reload();
    },
  });

  if (loading) {
    return <div className="h-72 animate-pulse rounded-card bg-white" />;
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <Link
          href="/kegiatan"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke kegiatan
        </Link>
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">
            {error ?? 'Kegiatan tidak ditemukan.'}
          </p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
        <PublicEmptyState
          title="Detail kegiatan tidak tersedia"
          description="Periksa kembali tautan atau pilih kegiatan lain."
        />
      </div>
    );
  }

  const detailEvent = { ...event, isRegistered: registered };
  const timeline = computeEventTimeline(detailEvent);
  const quota = computeQuotaState(event.quota, event.registeredCount);
  const gate = getRegistrationGate(detailEvent);
  const paid = event.feeType === 'INFAQ';

  const handleRegister = async () => {
    const result = await registration.register(detailEvent);
    if (result) toast(result.message, result.ok ? 'success' : 'error');
  };

  const handleSubmitPaid = async () => {
    const result = await registration.submitPaid();
    if (result) toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-6">
      <Link
        href="/kegiatan"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke kegiatan
      </Link>

      <Card className="overflow-hidden p-0">
        <div className="relative h-48 w-full bg-surface-blue/70">
          {event.bannerImage ? (
            <Image
              src={getImageUrl(event.bannerImage)}
              alt={`Banner kegiatan ${event.title}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-extrabold uppercase tracking-wide text-primary-deep">
              Poster Kegiatan
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={paid ? 'warning' : 'success'}>
              {paid ? 'Berbayar' : 'Gratis'}
            </Badge>
            <Badge tone={timeline.isRegistrationOpen ? 'info' : 'neutral'}>
              {timeline.label}
            </Badge>
            {registered ? <Badge tone="info">Sudah Terdaftar</Badge> : null}
          </div>

          <h1 className="text-2xl font-extrabold text-primary-deep">
            {event.title}
          </h1>

          <dl className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
            <div className="flex items-start gap-1.5">
              <CalendarDays
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                aria-hidden
              />
              <span>{formatDateId(event.eventDate)}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                aria-hidden
              />
              <span>
                {event.startTime}–{event.endTime} WIB
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                aria-hidden
              />
              <span>{event.location}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <UserRound
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                aria-hidden
              />
              <span>Fasilitator: {event.facilitatorName}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <Users
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                aria-hidden
              />
              <span>
                {quota.label} • {quota.registered}/{quota.quota} terdaftar
              </span>
            </div>
          </dl>

          <p className="text-sm leading-relaxed text-ink-soft">
            {event.description}
          </p>

          {paid ? (
            <p className="rounded-field border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-[#8a5807]">
              Infaq kegiatan: <strong>{formatRupiah(Number(event.infaqAmount))}</strong>.
              Bukti pembayaran diunggah setelah menekan tombol daftar.
            </p>
          ) : null}

          {!gate.allowed && !registered ? (
            <p className="text-sm text-danger">{gate.reason}</p>
          ) : null}

          <div className="max-w-sm">
            <EventRegisterButton
              event={detailEvent}
              timeline={timeline}
              quota={quota}
              registering={registration.registeringId === event.id}
              onRegister={() => void handleRegister()}
            />
          </div>

          {!user ? (
            <p className="text-xs text-ink-soft">
              Masuk ke akun member untuk mendaftar kegiatan.{' '}
              <Link
                href={`/login?next=${encodeURIComponent(`/kegiatan/${event.id}`)}`}
                className="font-semibold text-primary-deep underline-offset-4 hover:underline"
              >
                Masuk sekarang
              </Link>
            </p>
          ) : null}
        </div>
      </Card>

      <PaidRegistrationModal
        event={registration.registerTarget}
        proofFile={registration.proofFile}
        proofPreview={registration.proofPreview}
        registering={registration.registeringId !== null}
        onSelectProof={registration.selectProof}
        onClose={registration.closeModal}
        onSubmit={() => void handleSubmitPaid()}
      />
    </div>
  );
}
