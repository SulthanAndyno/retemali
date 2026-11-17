'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { createFinancialDonation } from '../api/donations.api';
import { DONATION_PURPOSES, MIN_DONATION, resolvePaymentMethod } from '../lib/donation-options';
import type { DonationActionResult, PaymentAccount } from '../types/donation.types';

export interface UseFinancialDonationFormResult {
  amount: number;
  donorName: string;
  donorEmail: string;
  purposeLabel: string;
  isAnonymous: boolean;
  loading: boolean;
  receiptCode: string | null;
  setAmount: (value: number) => void;
  setDonorName: (value: string) => void;
  setDonorEmail: (value: string) => void;
  setPurposeLabel: (value: string) => void;
  setAnonymous: (value: boolean) => void;
  submit: (account: PaymentAccount | null) => Promise<DonationActionResult>;
}

interface UseFinancialDonationFormOptions {
  initialName?: string;
  initialEmail?: string;
  onSuccess: () => void | Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memproses donasi';
}

export function useFinancialDonationForm({
  initialName = '',
  initialEmail = '',
  onSuccess,
}: UseFinancialDonationFormOptions): UseFinancialDonationFormResult {
  const [amount, setAmount] = useState(50000);
  const [donorName, setDonorName] = useState(initialName);
  const [donorEmail, setDonorEmail] = useState(initialEmail);
  const [purposeLabel, setPurposeLabel] = useState(DONATION_PURPOSES[0]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);

  const submit = async (account: PaymentAccount | null): Promise<DonationActionResult> => {
    if (!amount || amount < MIN_DONATION) {
      return { ok: false, message: 'Minimal donasi adalah Rp 10.000' };
    }
    if (!isAnonymous && !donorName.trim()) {
      return {
        ok: false,
        message: 'Masukkan nama donatur atau pilih opsi anonim',
      };
    }
    if (!account) {
      return {
        ok: false,
        message: 'Belum ada metode pembayaran aktif. Hubungi admin Rete Mali.',
      };
    }

    setLoading(true);
    try {
      const response = await createFinancialDonation({
        donorName: isAnonymous ? 'Hamba Allah' : donorName.trim(),
        donorEmail: donorEmail.trim() || undefined,
        isAnonymous,
        amount,
        purposeLabel,
        paymentMethod: resolvePaymentMethod(account),
      });
      const code = response.data?.receiptCode ?? null;
      setReceiptCode(code);
      await onSuccess();
      return {
        ok: true,
        message: 'Donasi berhasil dicatat! Terima kasih atas kebaikan Anda.',
        receiptCode: code ?? undefined,
      };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  return {
    amount,
    donorName,
    donorEmail,
    purposeLabel,
    isAnonymous,
    loading,
    receiptCode,
    setAmount,
    setDonorName,
    setDonorEmail,
    setPurposeLabel,
    setAnonymous: setIsAnonymous,
    submit,
  };
}
