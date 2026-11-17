'use client';

import Header from '@/components/layout/Header';
import { useRegisterForm } from '../hooks/use-register-form';
import { RegisterForm } from '../components/register-form';
import { RegisterSuccessCard } from '../components/register-success-card';

export function RegisterPage() {
  const form = useRegisterForm();

  if (form.successCode) {
    return (
      <RegisterSuccessCard code={form.successCode} onContinue={form.goToLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      <Header title="Daftar Anggota" showBack />
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Anggota Baru</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bergabunglah dengan komunitas membaca Rete Mali.
          </p>
        </div>

        <RegisterForm
          form={form.form}
          showPassword={form.showPassword}
          showConfirmPassword={form.showConfirmPassword}
          loading={form.loading}
          error={form.error}
          onChange={form.setField}
          onTogglePassword={form.togglePassword}
          onToggleConfirmPassword={form.toggleConfirmPassword}
          onSubmit={form.submit}
        />
      </div>
    </div>
  );
}
