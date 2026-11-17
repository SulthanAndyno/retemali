'use client';

import { useCallback, useState } from 'react';
import { quickCheckout, quickReturn } from '../api/volunteer.api';
import { errorMessage } from '../lib/volunteer-error';
import type { ActionResult } from '../types/volunteer.types';

export type CirculationTab = 'checkout' | 'return';

export interface UseQuickCirculationResult {
  tab: CirculationTab;
  memberCode: string;
  bookCode: string;
  pending: boolean;
  setTab: (tab: CirculationTab) => void;
  setMemberCode: (value: string) => void;
  setBookCode: (value: string) => void;
  submit: () => Promise<ActionResult>;
}

export function useQuickCirculation(
  onSuccess: () => void | Promise<void>
): UseQuickCirculationResult {
  const [tab, setTab] = useState<CirculationTab>('checkout');
  const [memberCode, setMemberCode] = useState('');
  const [bookCode, setBookCode] = useState('');
  const [pending, setPending] = useState(false);

  const submit = useCallback(async (): Promise<ActionResult> => {
    const cleanMember = memberCode.trim();
    const cleanBook = bookCode.trim();

    if (tab === 'checkout' && (!cleanMember || !cleanBook)) {
      return { ok: false, message: 'Masukkan ID Anggota dan Kode Buku' };
    }
    if (tab === 'return' && !cleanBook) {
      return { ok: false, message: 'Masukkan Kode Buku yang dikembalikan' };
    }

    setPending(true);
    try {
      if (tab === 'checkout') {
        await quickCheckout({
          memberIdentifier: cleanMember,
          bookIdentifier: cleanBook,
        });
      } else {
        await quickReturn({
          bookIdentifier: cleanBook,
          returnCondition: 'GOOD',
        });
      }

      setBookCode('');
      await onSuccess();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: errorMessage(err, 'Gagal memproses sirkulasi cepat'),
      };
    } finally {
      setPending(false);
    }
  }, [tab, memberCode, bookCode, onSuccess]);

  return {
    tab,
    memberCode,
    bookCode,
    pending,
    setTab,
    setMemberCode,
    setBookCode,
    submit,
  };
}
