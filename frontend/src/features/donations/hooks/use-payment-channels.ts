'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getPaymentAccounts } from '../api/donations.api';
import type { PaymentAccount } from '../types/donation.types';

export interface UsePaymentChannelsResult {
  accounts: PaymentAccount[];
  loading: boolean;
  error: string | null;
  selectedAccount: PaymentAccount | null;
  selectedAccountId: string | null;
  copiedField: string | null;
  reload: () => Promise<void>;
  selectAccount: (id: string) => void;
  copyAccountNumber: (account: PaymentAccount) => Promise<boolean>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat kanal pembayaran.';
}

export function usePaymentChannels(): UsePaymentChannelsResult {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaymentAccounts();
      const items = response.data ?? [];
      setAccounts(items);
      setSelectedAccountId((current) => {
        if (current && items.some((account) => account.id === current)) return current;
        return items[0]?.id ?? null;
      });
    } catch (loadError) {
      setAccounts([]);
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, [load]);

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null;

  const selectAccount = (id: string) => {
    setSelectedAccountId(id);
  };

  const copyAccountNumber = async (account: PaymentAccount): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(account.accountNumber ?? '');
      setCopiedField(account.id);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedField(null), 2500);
      return true;
    } catch {
      return false;
    }
  };

  return {
    accounts,
    loading,
    error,
    selectedAccount,
    selectedAccountId,
    copiedField,
    reload: load,
    selectAccount,
    copyAccountNumber,
  };
}
