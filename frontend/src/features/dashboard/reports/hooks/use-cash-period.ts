'use client';

import { useState } from 'react';
import { resolvePreset, type CashPreset } from '../lib/report-period';
import type { CashFilters } from '../types/report.types';

export interface UseCashPeriodResult {
  preset: CashPreset;
  from: string;
  to: string;
  applied: CashFilters;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  selectPreset: (preset: CashPreset) => void;
  apply: () => void;
}

export function useCashPeriod(): UseCashPeriodResult {
  const initial = resolvePreset('THIS_MONTH');
  const [preset, setPreset] = useState<CashPreset>('THIS_MONTH');
  const [from, setFromState] = useState(initial.from);
  const [to, setToState] = useState(initial.to);
  const [applied, setApplied] = useState<CashFilters>(initial);

  const setFrom = (value: string) => {
    setFromState(value);
    setPreset('CUSTOM');
  };

  const setTo = (value: string) => {
    setToState(value);
    setPreset('CUSTOM');
  };

  const selectPreset = (next: CashPreset) => {
    setPreset(next);
    if (next !== 'CUSTOM') {
      const range = resolvePreset(next);
      setFromState(range.from);
      setToState(range.to);
      setApplied(range);
    }
  };

  const apply = () => {
    setApplied({ from, to });
  };

  return { preset, from, to, applied, setFrom, setTo, selectPreset, apply };
}
