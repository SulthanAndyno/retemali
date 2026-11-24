'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { LinkButton } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { formatDateTimeId } from '@/shared/lib/format';
import { getBookDonationByCode } from '../api/donations.api';
import type { PhysicalBookDonationRecord } from '../types/donation.types';

export function BookConfirmationPage({ reference }: { reference: string }) {
  const [record, setRecord] = useState<PhysicalBookDonationRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(reference));

  useEffect(() => {
    if (!reference) return;

    let active = true;
    getBookDonationByCode(reference)
      .then((res) => {
        if (active) setRecord(res.data);
      })
      .catch(() => {
        if (active) setRecord(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reference]);

  const statusTone =
    record?.status === 'ACCEPTED'
      ? 'success'
      : record?.status === 'REJECTED'
        ? 'danger'
        : 'warning';

  const statusLabel =
    record?.status === 'ACCEPTED'
      ? 'Diterima & Masuk Kurasi'
      : record?.status === 'REJECTED'
        ? 'Ditolak Kurasi'
        : 'Menunggu Kurasi Relawan';

  return (
    <div className="space-y-6">
      <Link
        href="/donasi"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke pilihan donasi
      </Link>

      <div
        role="status"
        className="flex items-start gap-2.5 rounded-card border border-success/30 bg-green-50 px-4 py-4 text-sm"
      >
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-success"
          aria-hidden
        />
        <div>
          <p className="font-bold text-success">
            Terima kasih! Pengajuan donasi buku berhasil dicatat.
          </p>
          <p className="text-xs text-ink-soft">
            Silakan membawa buku langsung ke lokasi ReteMali sesuai jadwal yang
            telah dipilih.
          </p>
        </div>
      </div>

      <SectionTitle title="Konfirmasi Donasi Buku Fisik" />
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Nomor Permohonan:{' '}
            <span className="font-mono text-ink">
              {record?.batchCode || reference || '-'}
            </span>
          </p>
          {record ? <Badge tone={statusTone}>{statusLabel}</Badge> : null}
        </div>

        {loading ? (
          <div className="h-16 animate-pulse rounded-field bg-surface-soft" />
        ) : record ? (
          <dl className="grid gap-2 rounded-field bg-surface-soft p-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-soft">Donatur</dt>
              <dd className="font-semibold text-ink">{record.donorName}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">Paket Buku</dt>
              <dd className="font-semibold text-ink">{record.packageTitle}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">Jumlah Buku</dt>
              <dd className="font-semibold text-ink">
                {record.totalBooks} eksemplar
              </dd>
            </div>
            {record.createdAt ? (
              <div>
                <dt className="text-xs text-ink-soft">Waktu Pencatatan</dt>
                <dd className="font-semibold text-ink">
                  {formatDateTimeId(record.createdAt)}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="text-sm text-ink-soft">
            Pengajuan Anda menunggu pencatatan petugas saat buku diserahkan di
            taman baca.
          </p>
        )}

        <div className="grid gap-2 pt-2 sm:grid-cols-2">
          <LinkButton href="/donasi">Kembali ke Donasi</LinkButton>
          <LinkButton href="/donasi/status" variant="secondary">
            Cek Status Donasi
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
