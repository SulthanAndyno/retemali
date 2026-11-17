'use client';

import { useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { createBookDonation } from '../api/donations.api';
import type {
  DeliveryMethod,
  DonationActionResult,
} from '../types/donation.types';

export interface UseBookDonationFormResult {
  packageTitle: string;
  totalBooks: number;
  conditionNote: string;
  deliveryMethod: DeliveryMethod;
  loading: boolean;
  batchCode: string | null;
  setPackageTitle: (value: string) => void;
  setTotalBooks: (value: number) => void;
  setConditionNote: (value: string) => void;
  setDeliveryMethod: (value: DeliveryMethod) => void;
  submit: (donorName: string) => Promise<DonationActionResult>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal mengirim donasi buku';
}

export function useBookDonationForm(): UseBookDonationFormResult {
  const [packageTitle, setPackageTitle] = useState('');
  const [totalBooks, setTotalBooks] = useState(5);
  const [conditionNote, setConditionNote] = useState('Sangat baik / layak baca');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DROP_OFF');
  const [loading, setLoading] = useState(false);
  const [batchCode, setBatchCode] = useState<string | null>(null);

  const submit = async (donorName: string): Promise<DonationActionResult> => {
    if (packageTitle.trim().length < 3 || !Number.isFinite(totalBooks) || totalBooks < 1) {
      return { ok: false, message: 'Lengkapi rincian paket buku fisik' };
    }

    setLoading(true);
    try {
      const response = await createBookDonation({
        donorName: donorName.trim() || 'Warga Rete Mali',
        packageTitle: packageTitle.trim(),
        totalBooks: Number(totalBooks),
        conditionNote,
        deliveryMethod,
      });
      const code = response.data?.batchCode ?? null;
      setBatchCode(code);
      setPackageTitle('');
      return {
        ok: true,
        message: code
          ? `Pendataan donasi buku fisik berhasil! Kode batch: ${code}. Relawan kami akan memverifikasi di pos jaga.`
          : 'Pendataan donasi buku fisik berhasil! Relawan kami akan memverifikasi di pos jaga.',
        batchCode: code ?? undefined,
      };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  return {
    packageTitle,
    totalBooks,
    conditionNote,
    deliveryMethod,
    loading,
    batchCode,
    setPackageTitle,
    setTotalBooks,
    setConditionNote,
    setDeliveryMethod,
    submit,
  };
}
