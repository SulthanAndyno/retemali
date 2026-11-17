'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  BookUp2,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { formatRupiah } from '@/shared/lib/format';
import { useDonationSummary } from '../hooks/use-donation-summary';
import { usePaymentChannels } from '../hooks/use-payment-channels';

export function DonationPage() {
  const summary = useDonationSummary();
  const channels = usePaymentChannels();

  const hasPaymentInfo = channels.accounts.length > 0;

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Donasi ReteMali"
        description="Dukung Taman Baca ReteMali agar anak-anak dan warga terus punya akses baca yang layak."
      />

      <Card className="space-y-3 bg-surface-blue/50">
        <h2 className="text-base font-bold text-primary-deep">
          Untuk apa donasi digunakan?
        </h2>
        <ul className="grid gap-2 text-sm text-ink-soft sm:grid-cols-3">
          <li className="rounded-field bg-white px-3 py-2.5">
            <strong className="text-ink">Buku baru</strong> — menambah koleksi
            katalog peminjaman, khususnya buku anak.
          </li>
          <li className="rounded-field bg-white px-3 py-2.5">
            <strong className="text-ink">Kegiatan literasi</strong> — sesi baca,
            diskusi buku, dan kelas gratis untuk anggota.
          </li>
          <li className="rounded-field bg-white px-3 py-2.5">
            <strong className="text-ink">Operasional pojok baca</strong> —
            kebutuhan ruang supaya kegiatan tetap berjalan tiap pekan.
          </li>
        </ul>
        <p className="flex items-start gap-1.5 text-xs text-ink-soft">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Donasi tercatat dengan nomor referensi dan diperiksa bendahara — dapat
          diakses publik, tanpa perlu akun.
        </p>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Kampanye aktif
            </p>
            <h2 className="text-lg font-bold text-primary-deep">
              {summary.loading
                ? 'Memuat kampanye…'
                : (summary.campaign?.title ?? 'Donasi ReteMali')}
            </h2>
          </div>
          <Badge tone="info">{summary.percentage}% target</Badge>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500"
            style={{ width: `${summary.percentage}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
          <span>
            Terkumpul:{' '}
            <strong className="text-ink">
              {formatRupiah(summary.collectedAmount)}
            </strong>
          </span>
          <span>
            Target: <strong>{formatRupiah(summary.targetAmount)}</strong>
          </span>
        </div>
        {summary.error ? (
          <div className="flex items-center justify-between gap-2 rounded-field border border-red-200 bg-red-50 px-3 py-2 text-xs text-danger">
            <span>{summary.error}</span>
            <Button
              size="sm"
              variant="danger"
              onClick={() => void summary.reload()}
            >
              Coba Lagi
            </Button>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary-deep" aria-hidden />
            <h3 className="font-bold text-primary-deep">Donasi Finansial</h3>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Pilih nominal, bayar via QRIS/transfer bank resmi, lalu statusnya
            menunggu verifikasi admin — tidak ada klaim sukses otomatis.
          </p>
          {hasPaymentInfo ? (
            <Badge tone="info" className="mt-3 self-start">
              QRIS/rekening resmi tersedia
            </Badge>
          ) : (
            <div
              role="note"
              className="mt-3 rounded-field border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-[#8a5807]"
            >
              <p className="font-semibold">Instruksi pembayaran belum aktif</p>
              <p>Kanal pembayaran resmi belum diisi admin.</p>
            </div>
          )}
          <LinkButton href="/donasi/uang" size="md" className="mt-4 w-full">
            Donasi Sekarang
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <BookUp2 className="h-5 w-5 text-primary-deep" aria-hidden />
            <h3 className="font-bold text-primary-deep">
              Donasi Buku Fisik
            </h3>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Isi data donatur &amp; daftar buku, pilih rencana drop-off, datang
            langsung ke taman baca. Buku yang diterima dicatat petugas.
          </p>
          <div
            role="note"
            className="mt-3 flex items-start gap-2 rounded-field border border-primary/40 bg-surface-blue/60 px-3 py-2 text-xs font-semibold text-primary-deep"
          >
            <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Hanya drop-off langsung — pengiriman melalui kurir tidak
              tersedia.
            </span>
          </div>
          <LinkButton
            href="/donasi/buku"
            size="md"
            className="mt-4 w-full"
          >
            Isi Janji Drop-Off Buku
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </Card>
      </div>

      {channels.error ? (
        <div className="flex items-center justify-between gap-2 rounded-field border border-red-200 bg-red-50 px-3 py-2 text-xs text-danger">
          <span>Kanal pembayaran: {channels.error}</span>
          <Button
            size="sm"
            variant="danger"
            onClick={() => void channels.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : null}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">
            Lihat Riwayat &amp; Status Donasi
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Punya nomor referensi donasi (INV-RM-… / BDN-…)? Periksa statusnya
            tanpa perlu masuk akun.
          </p>
        </div>
        <Link
          href="/donasi/status"
          className="inline-flex items-center gap-2 rounded-field border border-primary/40 bg-surface-blue/60 px-4 py-2 text-sm font-bold text-primary-deep transition-colors hover:bg-surface-blue"
        >
          Buka Status Donasi
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Card>
    </div>
  );
}
