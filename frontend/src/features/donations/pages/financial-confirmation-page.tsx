'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CircleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { formatDateTimeId, formatRupiah } from '@/shared/lib/format';
import { useFinancialReceipt } from '../hooks/use-financial-receipt';

function statusMeta(status: string): {
  label: string;
  tone: 'success' | 'warning' | 'danger';
} {
  if (status === 'VERIFIED') return { label: 'Terverifikasi', tone: 'success' };
  if (status === 'FAILED') return { label: 'Gagal', tone: 'danger' };
  return { label: 'Menunggu verifikasi admin', tone: 'warning' };
}

export function FinancialConfirmationPage({
  reference,
}: {
  reference: string;
}) {
  const { receipt, loading, error, reload } = useFinancialReceipt(reference);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-card bg-white" />;
  }

  if (error || !receipt) {
    return (
      <div className="space-y-6">
        <Link
          href="/donasi"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke pilihan donasi
        </Link>
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm text-danger">
            <CircleAlert className="h-4 w-4" aria-hidden />
            {error ?? 'Kuitansi donasi tidak ditemukan.'}
          </p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <LinkButton href="/donasi/uang">Ajukan Donasi Lainnya</LinkButton>
          <LinkButton href="/donasi/status" variant="secondary">
            Cari Nomor Lain
          </LinkButton>
        </div>
      </div>
    );
  }

  const status = statusMeta(receipt.paymentStatus);

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
            Terima Kasih atas Dukungan Anda!
          </p>
          <p className="text-xs text-ink-soft">
            Setiap rupiah yang Anda donasikan menghidupkan ruang literasi
            anak-anak dan masyarakat di Taman Baca ReteMali.
          </p>
        </div>
      </div>

      <SectionTitle title="Status Donasi Finansial" />
      <Card className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Nomor Referensi:{' '}
          <span className="font-mono text-ink">{receipt.receiptCode}</span>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">
            Donasi — {formatRupiah(Number(receipt.amount))}
          </h2>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <dl className="space-y-1 text-sm text-ink-soft">
          <div>
            Donatur:{' '}
            <strong className="text-ink">
              {receipt.isAnonymous ? 'Hamba Allah' : receipt.donorName}
            </strong>
          </div>
          <div>Peruntukan: {receipt.purposeLabel}</div>
          <div>Metode: {receipt.paymentMethod}</div>
          <div>Waktu: {formatDateTimeId(receipt.createdAt)}</div>
          {receipt.verifiedAt ? (
            <div>Diverifikasi: {formatDateTimeId(receipt.verifiedAt)}</div>
          ) : null}
        </dl>
        <div className="grid gap-2 pt-2 sm:grid-cols-2">
          <LinkButton href="/donasi">Kembali ke Donasi</LinkButton>
          <LinkButton href="/donasi/status" variant="secondary">
            Cek Status Lain
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
