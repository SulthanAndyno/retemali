'use client';

import { useCallback, useState } from 'react';
import { checkInTicket } from '../api/volunteer.api';
import { errorMessage } from '../lib/volunteer-error';
import type { ActionResult } from '../types/volunteer.types';
import type { TicketCredential } from '@/features/events';

export interface UseTicketCheckInResult {
  showInput: boolean;
  code: string;
  pending: boolean;
  /** Kredensial peserta yang baru saja check-in, untuk ditunjukkan ke petugas. */
  credential: TicketCredential | null;
  openInput: () => void;
  setCode: (value: string) => void;
  submit: () => Promise<ActionResult>;
  closeCredential: () => void;
}

export function useTicketCheckIn(
  onSuccess: () => void | Promise<void>
): UseTicketCheckInResult {
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [credential, setCredential] = useState<TicketCredential | null>(null);

  const openInput = useCallback(() => setShowInput(true), []);

  const submit = useCallback(async (): Promise<ActionResult> => {
    const cleanCode = code.trim();
    if (!cleanCode) {
      return { ok: false, message: 'Masukkan Kode E-Tiket Peserta' };
    }

    setPending(true);
    try {
      const response = await checkInTicket(cleanCode);
      setCode('');
      setShowInput(false);
      if (response.data?.ticketCredential) {
        setCredential(response.data.ticketCredential);
      }
      await onSuccess();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: errorMessage(err, 'Tiket tidak valid atau sudah check-in'),
      };
    } finally {
      setPending(false);
    }
  }, [code, onSuccess]);

  return {
    showInput,
    code,
    pending,
    credential,
    openInput,
    setCode,
    submit,
    closeCredential: () => setCredential(null),
  };
}
