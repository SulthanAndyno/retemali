'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ACCESS_MODES, getAccessModeLabel } from '../lib/auth-options';
import type { AccessMode } from '../types';

export interface UseLoginFormResult {
  selectedRole: AccessMode | null;
  roleLabel: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  selectRole: (role: AccessMode) => void;
  closeForm: () => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  togglePassword: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  openPublicApp: () => void;
}

export function useLoginForm(): UseLoginFormResult {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<AccessMode | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectRole = (role: AccessMode) => {
    if (role === 'NON_MEMBER') {
      router.push('/');
      return;
    }

    const nextRole = selectedRole === role ? null : role;
    setSelectedRole(nextRole);
    setError('');

    const option = ACCESS_MODES.find((item) => item.key === nextRole);
    if (option?.demoEmail) setEmail(option.demoEmail);
    if (option?.demoPassword) setPassword(option.demoPassword);
  };

  const closeForm = () => {
    setSelectedRole(null);
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/portal');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login gagal. Periksa email & password.';
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
    selectRole,
    closeForm,
    setEmail,
    setPassword,
    togglePassword,
    submit,
    openPublicApp,
  };
}
