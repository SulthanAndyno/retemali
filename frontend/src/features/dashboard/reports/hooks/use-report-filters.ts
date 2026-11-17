'use client';

import { useEffect, useState } from 'react';
import { getEventOptions } from '../api/reports.api';
import type { AttendanceFilters, EventOption } from '../types/report.types';

const EMPTY_FILTERS: AttendanceFilters = { from: '', to: '', eventId: '' };

export interface UseReportFiltersResult {
  from: string;
  to: string;
  eventId: string;
  applied: AttendanceFilters;
  eventOptions: EventOption[];
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setEventId: (value: string) => void;
  apply: () => void;
  reset: () => void;
}

export function useReportFilters(
  initial: Partial<AttendanceFilters> = {}
): UseReportFiltersResult {
  const initialFrom = initial.from ?? '';
  const initialTo = initial.to ?? '';
  const initialEventId = initial.eventId ?? '';

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [eventId, setEventId] = useState(initialEventId);
  const [applied, setApplied] = useState<AttendanceFilters>({
    from: initialFrom,
    to: initialTo,
    eventId: initialEventId,
  });
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);

  useEffect(() => {
    let active = true;

    getEventOptions()
      .then((options) => {
        if (active) setEventOptions(options);
      })
      .catch(() => {
        // Dropdown tetap kosong; laporan utama tidak terpengaruh.
      });

    return () => {
      active = false;
    };
  }, []);

  const apply = () => {
    setApplied({ from, to, eventId });
  };

  const reset = () => {
    setFrom('');
    setTo('');
    setEventId('');
    setApplied(EMPTY_FILTERS);
  };

  return {
    from,
    to,
    eventId,
    applied,
    eventOptions,
    setFrom,
    setTo,
    setEventId,
    apply,
    reset,
  };
}
