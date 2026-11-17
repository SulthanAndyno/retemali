'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/features/auth';
import { useDonationSummary } from '../hooks/use-donation-summary';
import { usePaymentChannels } from '../hooks/use-payment-channels';
import { useFinancialDonationForm } from '../hooks/use-financial-donation-form';
import { useBookDonationForm } from '../hooks/use-book-donation-form';
import type { DonationType, PaymentAccount } from '../types/donation.types';
import { CampaignProgressCard } from '../components/campaign-progress-card';
import { DonationTypeSwitcher } from '../components/donation-type-switcher';
import { FinancialDonationForm } from '../components/financial-donation-form';
import { BookDonationForm } from '../components/book-donation-form';
import { ReceiptBanner } from '../components/receipt-banner';
import { DonationToast } from '../components/donation-toast';

type ToastState = { message: string; type: 'success' | 'error' } | null;

export function DonationPage() {
  const { user } = useAuth();
  const summary = useDonationSummary();
  const channels = usePaymentChannels();
  const financial = useFinancialDonationForm({
    initialName: user?.name ?? '',
    initialEmail: user?.email ?? '',
    onSuccess: summary.reload,
  });
  const book = useBookDonationForm();

  const [activeType, setActiveType] = useState<DonationType>('financial');
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleFinancialSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await financial.submit(channels.selectedAccount);
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleBookSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const donorName = user?.name || financial.donorName || 'Warga Rete Mali';
    const result = await book.submit(donorName);
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleCopy = async (account: PaymentAccount) => {
    const copied = await channels.copyAccountNumber(account);
    showToast(
      copied ? 'Nomor rekening berhasil disalin!' : 'Gagal menyalin nomor rekening',
      copied ? 'success' : 'error'
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/50 pb-24 text-slate-800">
      <DonationToast toast={toast} />

      <Header title="Donasi & Dukungan" subtitle="Gerakan Gotong Royong Literasi" />

      <main className="px-4 pt-3 space-y-4">
        <CampaignProgressCard
          campaignTitle={summary.campaign?.title ?? 'Kampanye Donasi'}
          targetAmount={summary.targetAmount}
          collectedAmount={summary.collectedAmount}
          percentage={summary.percentage}
          loading={summary.loading}
        />

        {summary.error ? (
          <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-xs text-rose-700">{summary.error}</p>
            <button
              type="button"
              onClick={() => void summary.reload()}
              className="text-[10px] font-bold text-rose-700 hover:underline shrink-0"
            >
              Coba Lagi
            </button>
          </div>
        ) : null}

        <DonationTypeSwitcher value={activeType} onChange={setActiveType} />

        {activeType === 'financial' ? (
          <FinancialDonationForm
            amount={financial.amount}
            donorName={financial.donorName}
            donorEmail={financial.donorEmail}
            purposeLabel={financial.purposeLabel}
            isAnonymous={financial.isAnonymous}
            loading={financial.loading}
            accounts={channels.accounts}
            selectedAccount={channels.selectedAccount}
            selectedAccountId={channels.selectedAccountId}
            copiedField={channels.copiedField}
            channelsLoading={channels.loading}
            channelsError={channels.error}
            onAmountChange={financial.setAmount}
            onPurposeChange={financial.setPurposeLabel}
            onAnonymousChange={financial.setAnonymous}
            onNameChange={financial.setDonorName}
            onEmailChange={financial.setDonorEmail}
            onSelectAccount={channels.selectAccount}
            onCopy={handleCopy}
            onSubmit={handleFinancialSubmit}
          />
        ) : (
          <BookDonationForm
            packageTitle={book.packageTitle}
            totalBooks={book.totalBooks}
            conditionNote={book.conditionNote}
            deliveryMethod={book.deliveryMethod}
            loading={book.loading}
            onPackageTitleChange={book.setPackageTitle}
            onTotalBooksChange={book.setTotalBooks}
            onConditionNoteChange={book.setConditionNote}
            onDeliveryMethodChange={book.setDeliveryMethod}
            onSubmit={handleBookSubmit}
          />
        )}

        {financial.receiptCode ? <ReceiptBanner code={financial.receiptCode} /> : null}
      </main>

      <BottomNav />
    </div>
  );
}
