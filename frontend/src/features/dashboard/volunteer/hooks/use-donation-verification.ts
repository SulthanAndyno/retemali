'use client';

import { useCallback, useState } from 'react';
import { verifyBookDonation } from '../api/volunteer.api';
import { errorMessage } from '../lib/volunteer-error';
import type { ActionResult } from '../types/volunteer.types';

export interface UseDonationVerificationResult {
  /** ID batch yang sedang diverifikasi, null bila idle. */
  pendingId: string | null;
  verify: (id: string) => Promise<ActionResult>;
}

export function useDonationVerification(
  onSuccess: () => void | Promise<void>
): UseDonationVerificationResult {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const verify = useCallback(
    async (id: string): Promise<ActionResult> => {
      setPendingId(id);
      try {
        await verifyBookDonation(id, { status: 'ACCEPTED' });
        await onSuccess();
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          message: errorMessage(err, 'Gagal memverifikasi donasi'),
        };
      } finally {
        setPendingId(null);
      }
    },
    [onSuccess]
  );

  return { pendingId, verify };
}
