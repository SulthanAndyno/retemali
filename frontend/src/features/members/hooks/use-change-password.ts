'use client';

import { useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { changeMemberPassword } from '../api/member.api';

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
  saving: boolean;
  setField: (field: keyof PasswordFormValues, value: string) => void;
  submit: () => Promise<PasswordActionResult>;
}

export function useChangePassword(): UseChangePasswordResult {
  const [form, setForm] = useState<PasswordFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);

  const setField = (field: keyof PasswordFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (): Promise<PasswordActionResult> => {
    if (!form.currentPassword) {
      return { ok: false, message: 'Kata sandi saat ini wajib diisi.' };
    }
    if (form.newPassword.length < 8) {
      return { ok: false, message: 'Kata sandi baru minimal 8 karakter.' };
    }
    if (!/[A-Z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)) {
      return {
        ok: false,
        message: 'Kata sandi baru harus memuat minimal 1 huruf kapital dan 1 angka.',
      };
    }
    if (form.newPassword === form.currentPassword) {
      return {
        ok: false,
        message: 'Kata sandi baru tidak boleh sama dengan kata sandi saat ini.',
      };
    }
    if (form.newPassword !== form.confirmPassword) {
      return { ok: false, message: 'Konfirmasi tidak sama dengan kata sandi baru.' };
    }

    setSaving(true);
    try {
      await changeMemberPassword(form);
      setForm(EMPTY);
      return { ok: true, message: 'Kata sandi berhasil diperbarui.' };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Gagal memperbarui kata sandi. Coba lagi.';
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  };

  return { form, saving, setField, submit };
}
