'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { applyVolunteer } from '../api/member.api';
import type { ActionResult } from './use-member-actions';

export interface VolunteerApplicationValues {
  majorOrJob: string;
  institution: string;
  division: string;
  motivation: string;
}

const INITIAL_VALUES: VolunteerApplicationValues = {
  majorOrJob: '',
  institution: '',
  division: 'Kelas Cerita',
  motivation: '',
};

export interface UseVolunteerApplicationResult {
  values: VolunteerApplicationValues;
  setField: (field: keyof VolunteerApplicationValues, value: string) => void;
  submit: () => Promise<ActionResult>;
  pending: boolean;
}

export function useVolunteerApplication(onSuccess: () => void): UseVolunteerApplicationResult {
  const [values, setValues] = useState<VolunteerApplicationValues>(INITIAL_VALUES);
  const [pending, setPending] = useState(false);

  const setField = useCallback(
    (field: keyof VolunteerApplicationValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const submit = useCallback(async (): Promise<ActionResult> => {
    if (!values.majorOrJob.trim() || !values.institution.trim() || !values.motivation.trim()) {
      return { ok: false, message: 'Mohon lengkapi seluruh formulir' };
    }

    setPending(true);
    try {
      await applyVolunteer({
        majorOrJob: values.majorOrJob.trim(),
        institution: values.institution.trim(),
        division: values.division,
        motivation: values.motivation.trim(),
      });
      setValues(INITIAL_VALUES);
      onSuccess();
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Gagal mendaftar relawan. Coba lagi.';
      return { ok: false, message };
    } finally {
      setPending(false);
    }
  }, [values, onSuccess]);

  return { values, setField, submit, pending };
}
