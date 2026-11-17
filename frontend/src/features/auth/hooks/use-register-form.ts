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
  rtRw: '',
};

export interface UseRegisterFormResult {
  form: RegisterFormValues;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: string;
  successCode: string | null;
  setField: (field: keyof RegisterFormValues, value: string) => void;
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
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const setField = (field: keyof RegisterFormValues, value: string) => {
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

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    setLoading(true);

    try {
      const user = await registerAccount({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        rtRw: form.rtRw,
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
    successCode,
    setField,
    togglePassword,
    toggleConfirmPassword,
    submit,
    goToLogin,
  };
}
