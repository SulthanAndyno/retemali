'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  approveAllVolunteerShifts,
  approveVolunteerShift,
} from '../api/admin.api';

export type ShiftApprovalResult = { ok: true } | { ok: false; message: string };

export interface UseShiftApprovalsResult {
  pendingId: string | null;
  approvingAll: boolean;
  approve: (id: string) => Promise<ShiftApprovalResult>;
  approveAll: () => Promise<ShiftApprovalResult>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useShiftApprovals(
  onSuccess: () => void | Promise<void>
): UseShiftApprovalsResult {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [approvingAll, setApprovingAll] = useState(false);

  const approve = useCallback(
    async (id: string): Promise<ShiftApprovalResult> => {
      setPendingId(id);
      try {
        await approveVolunteerShift(id);
        await onSuccess();
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          message: errorMessage(error, 'Gagal menyetujui shift.'),
        };
      } finally {
        setPendingId(null);
      }
    },
    [onSuccess]
  );

  const approveAll = useCallback(async (): Promise<ShiftApprovalResult> => {
    setApprovingAll(true);
    try {
      await approveAllVolunteerShifts();
      await onSuccess();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal menyetujui semua shift.'),
      };
    } finally {
      setApprovingAll(false);
    }
  }, [onSuccess]);

  return { pendingId, approvingAll, approve, approveAll };
}
