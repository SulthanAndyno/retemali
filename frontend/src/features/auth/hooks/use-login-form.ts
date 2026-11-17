'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAccessModeLabel } from '../lib/auth-options';
import { dashboardForRole } from '../lib/route-guard';
import type { AccessMode } from '../types';

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export interface UseLoginFormResult {
  selectedRole: AccessMode;
  roleLabel: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  errors: LoginFieldErrors;
  selectRole: (role: AccessMode) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  togglePassword: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  openPublicApp: () => void;
}

export function useLoginForm(): UseLoginFormResult {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<AccessMode>('NON_MEMBER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const selectRole = (role: AccessMode) => {
    setSelectedRole(role);
    setError('');
    setErrors({});
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginFieldErrors = {};
    if (!email.includes('@') || email.includes(' ')) {
      nextErrors.email = 'Masukkan alamat email yang valid.';
    }
    if (password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      const requestedNext =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('next')
          : null;
      const destination =
        requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
          ? requestedNext
          : dashboardForRole(loggedUser.role);
      router.replace(destination);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login gagal. Periksa email & password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const openPublicApp = () => {
    router.push('/');
  };

  return {
    selectedRole,
    roleLabel: getAccessModeLabel(selectedRole),
    email,
    password,
    showPassword,
    loading,
    error,
    errors,
    selectRole,
    setEmail,
    setPassword,
    togglePassword,
    submit,
    openPublicApp,
  };
}
