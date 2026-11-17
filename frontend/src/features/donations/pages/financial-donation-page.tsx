'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, HeartHandshake, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { useAuth } from '@/features/auth';
import { formatRupiah } from '@/shared/lib/format';
import { useFinancialDonationForm } from '../hooks/use-financial-donation-form';
import { usePaymentChannels } from '../hooks/use-payment-channels';
import {
  DONATION_PRESETS,
  DONATION_PURPOSES,
  MIN_DONATION,
} from '../lib/donation-options';

export function FinancialDonationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const channels = usePaymentChannels();
  const financial = useFinancialDonationForm({
    initialName: user?.name ?? '',
    initialEmail: user?.email ?? '',
    onSuccess: () => undefined,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await financial.submit(channels.selectedAccount);
    setSubmitting(false);

    if (!result.ok) {
      toast(result.message, 'error');
      return;
    }

    if (result.receiptCode) {
      router.push(
        `/donasi/uang/konfirmasi?ref=${encodeURIComponent(result.receiptCode)}`
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
        title="Donasi Finansial"
        description="Data donatur dicatat untuk konfirmasi & pengecekan status; bukti transfer diverifikasi admin."
      />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Card className="space-y-3 bg-surface-blue/50">
          <p className="flex items-start gap-2 text-sm text-primary-deep">
            <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Donasi Anda mendukung pengadaan buku baru, kegiatan literasi anak,
            dan operasional pojok baca ReteMali.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-primary-deep">
            Pilih Nominal Donasi
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DONATION_PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => financial.setAmount(value)}
                aria-pressed={financial.amount === value}
                className={`rounded-field border px-3 py-2.5 text-sm font-bold transition-colors ${
                  financial.amount === value
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-white text-ink hover:border-primary/60'
                }`}
              >
                {formatRupiah(value)}
              </button>
            ))}
          </div>
          <Input
            id="don-amount"
            label="Nominal Donasi"
            type="number"
            min={MIN_DONATION}
            step={1000}
            value={financial.amount}
            onChange={(event) => financial.setAmount(Number(event.target.value))}
            hint={`Minimal donasi ${formatRupiah(MIN_DONATION)}.`}
          />
          <label
            htmlFor="don-purpose"
            className="block text-sm font-semibold text-ink"
          >
            Peruntukan Donasi
            <select
              id="don-purpose"
              value={financial.purposeLabel}
              onChange={(event) => financial.setPurposeLabel(event.target.value)}
              className="mt-1.5 w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {DONATION_PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </label>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-primary-deep">
            Data Donatur
          </h2>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={financial.isAnonymous}
              onChange={(event) =>
                financial.setAnonymous(event.target.checked)
              }
              className="h-4 w-4"
            />
            Donasi sebagai anonim
          </label>
          {!financial.isAnonymous ? (
            <>
              <Input
                id="don-name"
                label="Nama Lengkap Donatur"
                autoComplete="name"
                value={financial.donorName}
                onChange={(event) =>
                  financial.setDonorName(event.target.value)
                }
              />
              <Input
                id="don-email"
                label="Alamat Email"
                type="email"
                autoComplete="email"
                value={financial.donorEmail}
                onChange={(event) =>
                  financial.setDonorEmail(event.target.value)
                }
                hint="Opsional, untuk konfirmasi donasi."
              />
            </>
          ) : null}
        </Card>

        <Card className="space-y-3">
          <h2 className="text-base font-bold text-primary-deep">
            Metode Pembayaran
          </h2>
          {channels.loading ? (
            <div className="h-24 animate-pulse rounded-field bg-surface-soft" />
          ) : channels.accounts.length === 0 ? (
            <p className="rounded-field border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-[#8a5807]">
              Belum ada kanal pembayaran aktif. Hubungi admin ReteMali.
            </p>
          ) : (
            <div className="space-y-2">
              {channels.accounts.map((account) => (
                <label
                  key={account.id}
                  className={`flex cursor-pointer items-start justify-between gap-3 rounded-field border px-3.5 py-3 text-sm transition-colors ${
                    channels.selectedAccountId === account.id
                      ? 'border-primary bg-surface-blue/60'
                      : 'border-surface-soft bg-white'
                  }`}
                >
                  <span className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="don-account"
                      checked={channels.selectedAccountId === account.id}
                      onChange={() => channels.selectAccount(account.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      <span className="block font-semibold text-ink">
                        {account.providerName}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {account.type === 'QRIS'
                          ? `QRIS • NMID ${account.qrisNmid ?? '-'}`
                          : `${account.accountNumber ?? '-'} a.n. ${
                              account.accountName ?? '-'
                            }`}
                      </span>
                    </span>
                  </span>
                  {account.type === 'QRIS' ? (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                      QRIS
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                      Bank
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
          <p className="flex items-start gap-1.5 text-xs text-ink-soft">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Setelah donasi dicatat, status menunggu verifikasi admin — bukan
            otomatis berhasil.
          </p>
        </Card>

        <Button
          type="submit"
          loading={submitting || financial.loading}
          className="w-full sm:w-auto"
        >
          Lanjutkan Pembayaran Donasi
        </Button>
      </form>
    </div>
  );
}
