'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useRegisterForm } from '../hooks/use-register-form';
import { RegisterForm } from '../components/register-form';
import { RegisterSuccessCard } from '../components/register-success-card';

export function RegisterPage() {
  const form = useRegisterForm();

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      <div className="mb-6">
        <Link
          href="/login"
          className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali
        </Link>
        {!form.successCode ? (
          <>
            <h1 className="text-xl font-bold text-primary-deep">
              Registrasi Member Baru
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Daftar sekarang untuk meminjam buku, reservasi kegiatan komunitas,
              dan menikmati fasilitas digital ReteMali.
            </p>
          </>
        ) : (
          <h1 className="text-xl font-bold text-primary-deep">
            Registrasi Member
          </h1>
        )}
      </div>

      <Card>
        {form.successCode ? (
          <RegisterSuccessCard
            code={form.successCode}
            onContinue={form.goToLogin}
          />
        ) : (
          <RegisterForm
            form={form.form}
            showPassword={form.showPassword}
            showConfirmPassword={form.showConfirmPassword}
            loading={form.loading}
            error={form.error}
            errors={form.errors}
            onChange={form.setField}
            onTogglePassword={form.togglePassword}
            onToggleConfirmPassword={form.toggleConfirmPassword}
            onSubmit={form.submit}
          />
        )}
      </Card>
    </div>
  );
}
