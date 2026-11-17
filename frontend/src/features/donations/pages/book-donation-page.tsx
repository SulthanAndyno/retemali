'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookUp2, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/features/auth';
import { useBookDonationForm } from '../hooks/use-book-donation-form';

export function BookDonationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const book = useBookDonationForm();
  const [donorName, setDonorName] = useState(user?.name ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await book.submit(donorName);
    setSubmitting(false);

    if (!result.ok) {
      toast(result.message, 'error');
      return;
    }

    if (result.batchCode) {
      router.push(
        `/donasi/buku/konfirmasi?ref=${encodeURIComponent(result.batchCode)}`
      );
      return;
    }

    toast(result.message, 'success');
  };

  return (
    <div className="space-y-6">
      <Link
        href="/donasi"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke pilihan donasi
      </Link>

      <SectionTitle
        title="Donasi Buku Fisik"
        description="Program penerimaan buku untuk koleksi pojok baca — penyerahan hanya melalui drop-off langsung."
      />

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-primary-deep">
          <BookUp2 className="h-5 w-5" aria-hidden />
          Buku yang Diterima
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-ink-soft">
          <li>Ensiklopedia &amp; referensi anak</li>
          <li>Fiksi remaja &amp; dongeng anak</li>
          <li>Sains populer</li>
        </ul>
        <p className="text-xs text-ink-soft">
          Kondisi minimal 60% masih baik — bukan halaman lepas/rusak total.
          Petugas berhak menolak buku di luar ketentuan saat serah terima.
        </p>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-deep">
          <MapPin className="h-4 w-4" aria-hidden />
          Waktu drop-off mengikuti jam layanan taman baca.
        </p>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="flex items-start gap-2.5 rounded-field border border-primary/40 bg-surface-blue/60 px-3.5 py-3 text-sm font-semibold text-primary-deep">
          <Truck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <span>
            Donasi buku fisik hanya dapat dilakukan melalui drop-off langsung di
            Taman Baca ReteMali. Pengiriman melalui kurir tidak tersedia.
          </span>
        </div>

        <Card className="space-y-4">
          <Input
            id="book-donor"
            label="Nama Donatur"
            autoComplete="name"
            value={donorName}
            onChange={(event) => setDonorName(event.target.value)}
            hint="Boleh nama perwakilan atau komunitas."
          />
          <Input
            id="book-package"
            label="Judul / Kategori Paket Buku"
            placeholder="Contoh: 15 Buku Ensiklopedia & Cerita Rakyat"
            value={book.packageTitle}
            onChange={(event) => book.setPackageTitle(event.target.value)}
          />
          <Input
            id="book-total"
            label="Perkiraan Jumlah Buku"
            type="number"
            min={1}
            value={book.totalBooks}
            onChange={(event) => book.setTotalBooks(Number(event.target.value))}
          />
          <Textarea
            id="book-condition"
            label="Kondisi Buku"
            value={book.conditionNote}
            onChange={(event) => book.setConditionNote(event.target.value)}
            hint="Contoh: layak baca, cover lengkap, beberapa halaman ada lipatan."
          />
          <div className="rounded-field border border-surface-soft bg-surface-blue/50 px-3.5 py-3 text-sm text-primary-deep">
            Metode penyerahan: <strong>Drop-off langsung</strong>
          </div>
        </Card>

        <Button
          type="submit"
          loading={submitting || book.loading}
          className="w-full sm:w-auto"
        >
          Isi Janji Drop-Off Buku
        </Button>
      </form>
    </div>
  );
}
