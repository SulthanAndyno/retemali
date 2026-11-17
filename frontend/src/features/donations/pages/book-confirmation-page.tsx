import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { DummyNotice } from '../components/dummy-notice';

export function BookConfirmationPage({ reference }: { reference: string }) {
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
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Nomor Permohonan:{' '}
          <span className="font-mono text-ink">{reference || '-'}</span>
        </p>
        <p className="text-sm text-ink-soft">
          Pengajuan Anda menunggu pencatatan petugas saat buku diserahkan di
          taman baca.
        </p>
        <DummyNotice />
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
