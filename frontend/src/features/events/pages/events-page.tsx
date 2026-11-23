'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarX } from 'lucide-react';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { useEvents } from '../hooks/use-events';
import { useAutoClose } from '../hooks/use-auto-close';
import { PublicEventCard } from '../components/public-event-card';

type EventFilter = 'semua' | 'gratis' | 'berbayar' | 'selesai';

const FILTER_OPTIONS: { value: EventFilter; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'gratis', label: 'Gratis' },
  { value: 'berbayar', label: 'Tiket Masuk' },
  { value: 'selesai', label: 'Selesai' },
];

function resolveFilter(value?: string): EventFilter {
  return value === 'gratis' ||
    value === 'berbayar' ||
    value === 'selesai'
    ? value
    : 'semua';
}

export function EventsPage({ initialFilter }: { initialFilter?: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<EventFilter>(resolveFilter(initialFilter));
  const events = useEvents();
  const autoClose = useAutoClose();

  const selectFilter = (next: EventFilter) => {
    setFilter(next);
    router.replace(
      next === 'semua' ? '/kegiatan' : `/kegiatan?filter=${next}`,
      { scroll: false }
    );
  };

  const visible = events.events.filter((event) => {
    if (filter === 'gratis') return event.feeType === 'FREE';
    if (filter === 'berbayar') return event.feeType === 'PAID';
    if (filter === 'selesai') return event.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Kegiatan Komunitas"
        description="Temukan kegiatan literasi ReteMali — kegiatan gratis bisa langsung didaftarkan, kegiatan dengan Pembayaran Tiket Masuk memerlukan bukti transfer sebelum E-Tiket aktif."
      />

      <nav
        aria-label="Filter kegiatan"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {FILTER_OPTIONS.map((option) => {
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(option.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-soft bg-white text-ink-soft hover:border-primary/50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </nav>

      {events.error ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{events.error}</p>
          <Button
            size="sm"
            variant="danger"
            onClick={() => void events.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : events.loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-card bg-white"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-surface-soft bg-white px-6 py-10 text-center">
          <CalendarX className="h-6 w-6 text-ink-soft/70" aria-hidden />
          <p className="font-semibold text-ink">
            {filter === 'selesai'
              ? 'Belum ada kegiatan yang sudah selesai'
              : 'Belum ada kegiatan pada kategori ini'}
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            Kegiatan yang dipublikasikan pengelola akan tampil di sini. Coba
            pilih kategori lain.
          </p>
          <Link
            href="/kegiatan"
            className="mt-2 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
          >
            Lihat semua kegiatan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((event) => (
            <PublicEventCard
              key={event.id}
              event={event}
              autoCloseState={autoClose.states[event.id] ?? null}
            />
          ))}
        </div>
      )}

      <div className="rounded-card border border-surface-soft bg-white p-4 text-center">
        <p className="text-sm text-ink-soft">
          Ingin ikut kegiatan? Masuk ke akun member untuk mendaftar dan
          mendapatkan E-Tiket.
        </p>
        <LinkButton href="/login" size="sm" className="mt-3">
          Masuk untuk Mendaftar
        </LinkButton>
      </div>
    </div>
  );
}
