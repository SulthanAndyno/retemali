'use client';

import { useCallback, useEffect, useState } from 'react';
import { clockIn, clockOut } from '../api/volunteer.api';
import {
  DEFAULT_CLOCK_OUT_SUMMARY,
  DEFAULT_SHIFT_LOCATION,
  DEFAULT_SHIFT_TYPE,
} from '../lib/volunteer-constants';
import { errorMessage } from '../lib/volunteer-error';
import { formatDuration } from '../lib/volunteer-format';
import type { ActionResult, VolunteerShift } from '../types/volunteer.types';

export interface UseShiftClockResult {
  isClockedIn: boolean;
  /** `HH : MM : SS` dihitung dari `clockInAt`. */
  duration: string;
  pending: boolean;
  toggle: (options?: { taskSummary?: string }) => Promise<ActionResult>;
}

export function useShiftClock(
  activeShift: VolunteerShift | null,
  onChanged: () => void | Promise<void>
): UseShiftClockResult {
  const [now, setNow] = useState(() => Date.now());
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!activeShift) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeShift]);

  const startedAt = activeShift ? new Date(activeShift.clockInAt).getTime() : 0;
  const elapsedSeconds =
    Number.isFinite(startedAt) && startedAt > 0 ? (now - startedAt) / 1000 : 0;

  const toggle = useCallback(
    async (options?: { taskSummary?: string }): Promise<ActionResult> => {
      setPending(true);
      try {
        if (activeShift) {
          const summary = (options?.taskSummary ?? '').trim();
          await clockOut({
            taskSummary: summary.length >= 3 ? summary : DEFAULT_CLOCK_OUT_SUMMARY,
          });
        } else {
          await clockIn({
            shiftType: DEFAULT_SHIFT_TYPE,
            location: DEFAULT_SHIFT_LOCATION,
          });
        }

        await onChanged();
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          message: errorMessage(err, 'Gagal mengubah status shift.'),
        };
      } finally {
        setPending(false);
      }
    },
    [activeShift, onChanged]
  );

  return {
    isClockedIn: Boolean(activeShift),
    duration: formatDuration(elapsedSeconds),
    pending,
    toggle,
  };
}
