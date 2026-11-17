'use client';

import { useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { changePassword } from '../api/account.api';

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY: PasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export interface PasswordActionResult {
  ok: boolean;
  message: string;
}

export interface UseChangePasswordResult {
  form: PasswordFormValues;
  error: string | null;
  saving: boolean;
  setField: (field: keyof PasswordFormValues, value: string) => void;
  submit: () => Promise<PasswordActionResult>;
}

export function useChangePassword(): UseChangePasswordResult {
  const [form, setForm] = useState<PasswordFormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (field: keyof PasswordFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (): Promise<PasswordActionResult> => {
    setError(null);

    if (form.newPassword.length < 8) {
      return { ok: false, message: 'Kata sandi baru minimal 8 karakter.' };
    }
    if (!/[A-Z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)) {
      return {
        ok: false,
        message: 'Kata sandi baru harus memuat huruf besar dan angka.',
      };
    }
    if (form.newPassword !== form.confirmPassword) {
      return { ok: false, message: 'Konfirmasi kata sandi tidak cocok.' };
    }

    setSaving(true);
    try {
      await changePassword(form);
      setForm(EMPTY);
      return { ok: true, message: 'Kata sandi berhasil diperbarui.' };
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : 'Gagal memperbarui kata sandi.';
      setError(message);
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  };

  return { form, error, saving, setField, submit };
}
