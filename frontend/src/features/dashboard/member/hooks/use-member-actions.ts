'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  cancelReservation as cancelReservationRequest,
  extendLoan as extendLoanRequest,
} from '../api/member.api';

export type ActionResult = { ok: true } | { ok: false; message: string };

export interface UseMemberActionsResult {
  /** ID item yang sedang diproses (loan/reservation), null bila idle. */
  pendingId: string | null;
  extendLoan: (loanId: string) => Promise<ActionResult>;
  cancelReservation: (reservationId: string) => Promise<ActionResult>;
}

function messageFrom(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useMemberActions(onSuccess: () => void | Promise<void>): UseMemberActionsResult {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const run = useCallback(
    async (
      id: string,
      action: () => Promise<unknown>,
      fallback: string
    ): Promise<ActionResult> => {
      setPendingId(id);
      try {
        await action();
        await onSuccess();
        return { ok: true };
      } catch (err) {
        return { ok: false, message: messageFrom(err, fallback) };
      } finally {
        setPendingId(null);
      }
    },
    [onSuccess]
  );

  const extendLoan = useCallback(
    (loanId: string) =>
      run(loanId, () => extendLoanRequest(loanId), 'Gagal memperpanjang pinjaman.'),
    [run]
  );

  const cancelReservation = useCallback(
    (reservationId: string) =>
      run(
        reservationId,
        () => cancelReservationRequest(reservationId),
        'Gagal membatalkan peminjaman.'
      ),
    [run]
  );

  return { pendingId, extendLoan, cancelReservation };
}
