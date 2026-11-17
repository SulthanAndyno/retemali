'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getDonationSummary } from '../api/donations.api';
import { getCampaignPercentage } from '../lib/donation-options';
import type { DonationCampaign, DonationSummary } from '../types/donation.types';

export interface UseDonationSummaryResult {
  campaign: DonationCampaign | null;
  targetAmount: number;
  collectedAmount: number;
  percentage: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat ringkasan donasi.';
}

export function useDonationSummary(): UseDonationSummaryResult {
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getDonationSummary();
      if (requestId !== requestIdRef.current) return;
      setSummary(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const campaign = summary?.campaign ?? null;
  const targetAmount = Number(campaign?.targetAmount ?? 0);
  const collectedAmount = Number(campaign?.collectedAmount ?? 0);

  return {
    campaign,
    targetAmount,
    collectedAmount,
    percentage: getCampaignPercentage(collectedAmount, targetAmount),
    loading,
    error,
    reload: load,
  };
}
