'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerAccount } from '../api/auth.client';
import type { RegisterFormValues } from '../types';

const INITIAL_FORM: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  agreedTerms: false,
};

export interface RegisterFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreedTerms?: string;
}

export interface UseRegisterFormResult {
  form: RegisterFormValues;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: string;
  errors: RegisterFieldErrors;
  successCode: string | null;
  setField: <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K]
  ) => void;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  goToLogin: () => void;
}

export function useRegisterForm(): UseRegisterFormResult {
  const router = useRouter();

  const [form, setForm] = useState<RegisterFormValues>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const setField = <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((current) => !current);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const nextErrors: RegisterFieldErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Nama lengkap minimal 2 karakter.';
    }
    if (!form.email.includes('@') || form.email.includes(' ')) {
      nextErrors.email = 'Masukkan alamat email yang valid.';
    }
    if (form.phone.trim().length < 8) {
      nextErrors.phone = 'Nomor WhatsApp/HP minimal 8 digit.';
    }
    if (form.password.length < 8) {
      nextErrors.password = 'Kata sandi minimal 8 karakter.';
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Konfirmasi kata sandi tidak sama.';
    }
    if (!form.agreedTerms) {
      nextErrors.agreedTerms = 'Persetujuan ketentuan anggota wajib dicentang.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const user = await registerAccount({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });
      setSuccessCode(user.memberCode);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Pendaftaran gagal. Coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return {
    form,
    showPassword,
    showConfirmPassword,
    loading,
    error,
    errors,
    successCode,
    setField,
    togglePassword,
    toggleConfirmPassword,
    submit,
    goToLogin,
  };
}
