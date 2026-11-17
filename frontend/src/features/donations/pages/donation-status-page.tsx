'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { getFinancialReceipt } from '../api/donations.api';
import { DUMMY_BOOK_DONATION_STATUS } from '../fixtures/public-donation-dummy';
import { DummyNotice } from '../components/dummy-notice';

export function DonationStatusPage() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = reference.trim().toUpperCase();
    if (!value) return;

    setChecking(true);
    setError(null);

    try {
      if (value.startsWith('BDN')) {
        const book = DUMMY_BOOK_DONATION_STATUS[value];
        if (!book) {
          setError('Nomor referensi donasi buku tidak ditemukan.');
          return;
        }
        router.push(
          `/donasi/buku/konfirmasi?ref=${encodeURIComponent(value)}`
        );
        return;
      }

      await getFinancialReceipt(value);
      router.push(`/donasi/uang/konfirmasi?ref=${encodeURIComponent(value)}`);
    } catch {
      setError(
        'Nomor referensi tidak ditemukan. Periksa format INV-RM-… atau BDN-…'
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Status & Riwayat Donasi"
        description="Masukkan nomor referensi donasi Anda (INV-RM-… untuk finansial, BDN-… untuk buku fisik)."
      />

      <Card className="space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label
            htmlFor="donation-ref"
            className="block text-sm font-semibold text-ink"
          >
            Nomor Referensi Donasi
          </label>
          <input
            id="donation-ref"
            type="text"
            required
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="INV-RM-2026-0001 atau BDN-2026-0001"
            className="w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button type="submit" loading={checking} className="w-full">
            <Search className="h-4 w-4" aria-hidden />
            Periksa Status Donasi
          </Button>
        </form>

        {error ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-field border border-danger/30 bg-red-50 px-3 py-2.5 text-sm text-danger"
          >
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden
            />
            <span>{error}</span>
          </div>
        ) : null}

        <DummyNotice />
      </Card>
    </div>
  );
}
