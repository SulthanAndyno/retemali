'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/lib/api';
import { reviewVolunteerApplication } from '../api/admin.api';
import type { ReviewVolunteerApplicationInput } from '../types/admin.types';

export type VolunteerApprovalResult = { ok: true } | { ok: false; message: string };

export interface UseVolunteerApprovalsResult {
  pendingId: string | null;
  review: (
    id: string,
    input: ReviewVolunteerApplicationInput
  ) => Promise<VolunteerApprovalResult>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memproses pendaftaran relawan.';
}

export function useVolunteerApprovals(
  onSuccess: () => void | Promise<void>
): UseVolunteerApprovalsResult {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const review = useCallback(
    async (
      id: string,
      input: ReviewVolunteerApplicationInput
    ): Promise<VolunteerApprovalResult> => {
      setPendingId(id);
      try {
        await reviewVolunteerApplication(id, input);
        await onSuccess();
        return { ok: true };
      } catch (error) {
        return { ok: false, message: errorMessage(error) };
      } finally {
        setPendingId(null);
      }
    },
    [onSuccess]
  );

  return { pendingId, review };
}
