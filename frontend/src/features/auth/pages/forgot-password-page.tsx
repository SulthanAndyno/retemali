'use client';

import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ForgotPasswordForm } from '../components/forgot-password-form';

export function ForgotPasswordPage() {
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
        <h1 className="text-xl font-bold text-primary-deep">
          Atur Ulang Kata Sandi
        </h1>
      </div>

      <div className="space-y-4">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-blue"
          aria-hidden
        >
          <Lock className="h-6 w-6 text-primary-deep" />
        </div>
        <p className="rounded-field bg-surface-blue/60 px-4 py-3 text-sm text-ink">
          Masukkan email akun Anda untuk menyiapkan pesan pemulihan langsung ke
          Admin ReteMali. Pengelola akan membantu mereset kata sandi atau
          memperbarui email akun Anda.
        </p>
        <Card>
          <ForgotPasswordForm />
        </Card>
        <Link href="/login" className="block">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke Halaman Masuk
          </Button>
        </Link>
      </div>
    </div>
  );
}
