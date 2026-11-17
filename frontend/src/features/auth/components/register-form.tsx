import Link from 'next/link';
import type { FormEvent } from 'react';
import {
  CircleAlert,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RegisterFieldErrors } from '../hooks/use-register-form';
import type { RegisterFormValues } from '../types';

interface RegisterFormProps {
  form: RegisterFormValues;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: string;
  errors: RegisterFieldErrors;
  onChange: <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K]
  ) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      {shown ? (
        <EyeOff className="h-4 w-4" aria-hidden />
      ) : (
        <Eye className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

export function RegisterForm({
  form,
  showPassword,
  showConfirmPassword,
  loading,
  error,
  errors,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-field border border-danger/30 bg-red-50 px-3 py-2.5 text-xs text-danger"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      ) : null}

      <Input
        id="daftar-nama"
        label="Nama Lengkap (Sesuai Identitas)"
        autoComplete="name"
        placeholder="Contoh: Siti Rahmawati"
        value={form.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={errors.name}
      />
      <Input
        id="daftar-email"
        label="Alamat Email Aktif"
        type="email"
        autoComplete="email"
        placeholder="siti.rahmawati@contoh-email.test"
        value={form.email}
        onChange={(event) => onChange('email', event.target.value)}
        error={errors.email}
      />
      <Input
        id="daftar-telepon"
        label="Nomor WhatsApp / HP"
        type="tel"
        autoComplete="tel"
        placeholder="0812-3456-7890"
        value={form.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        error={errors.phone}
      />
      <Input
        id="daftar-sandi"
        label="Kata Sandi (Min. 8 Karakter)"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="••••••••"
        value={form.password}
        onChange={(event) => onChange('password', event.target.value)}
        error={errors.password}
        trailingNode={
          <PasswordToggle
            shown={showPassword}
            onToggle={onTogglePassword}
          />
        }
      />
      <Input
        id="daftar-sandi-konfirmasi"
        label="Konfirmasi Kata Sandi"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={(event) => onChange('confirmPassword', event.target.value)}
        error={errors.confirmPassword}
        trailingNode={
          <PasswordToggle
            shown={showConfirmPassword}
            onToggle={onToggleConfirmPassword}
          />
        }
      />

      <div>
        <label
          htmlFor="daftar-persetujuan"
          className="flex items-start gap-2 text-sm text-ink"
        >
          <input
            id="daftar-persetujuan"
            type="checkbox"
            checked={form.agreedTerms}
            onChange={(event) => onChange('agreedTerms', event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1B5EB8]"
          />
          <span>
            Saya menyetujui Ketentuan Anggota &amp; Kebijakan Privasi ReteMali
          </span>
        </label>
        {errors.agreedTerms ? (
          <p className="mt-1.5 text-xs font-medium text-danger">
            {errors.agreedTerms}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        <UserPlus className="h-4 w-4" aria-hidden />
        Daftar Sebagai Member ReteMali
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Sudah memiliki akun terdaftar?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        Perlindungan Data Aman • Taman Baca ReteMali
      </p>
    </form>
  );
}
