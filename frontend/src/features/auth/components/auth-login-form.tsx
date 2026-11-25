import Link from 'next/link';
import type { FormEvent } from 'react';
import { CircleAlert, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { LoginFieldErrors } from '../hooks/use-login-form';
import type { AccessMode } from '../types';

interface AuthLoginFormProps {
  mode: Exclude<AccessMode, 'NON_MEMBER'>;
  roleLabel: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  errors: LoginFieldErrors;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

const HINTS: Record<Exclude<AccessMode, 'NON_MEMBER'>, string | null> = {
  MEMBER: null,
  VOLUNTEER:
    'Gunakan akun volunteer yang sudah disetujui admin untuk membuka dashboard volunteer.',
  ADMIN:
    'Khusus pengelola ReteMali. Masuk dengan akun administrator yang diberikan pengurus.',
};

export function AuthLoginForm({
  mode,
  roleLabel,
  email,
  password,
  showPassword,
  loading,
  error,
  errors,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: AuthLoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {HINTS[mode] ? (
        <p className="rounded-field bg-surface-blue px-3 py-2 text-xs text-primary-deep">
          {HINTS[mode]}
        </p>
      ) : null}

      <Input
        id={`${mode}-email`}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nama@contoh-email.test"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        error={errors.email}
      />
      <Input
        id={`${mode}-password`}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        error={errors.password}
        trailingNode={
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={
              showPassword ? 'Sembunyikan password' : 'Tampilkan password'
            }
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        }
      />

      {error ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-field border border-danger/30 bg-red-50 px-3 py-2.5 text-xs text-danger"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/login/lupa-password"
          className="text-xs font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <span className="inline-flex items-center gap-1">
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            Lupa password?
          </span>
        </Link>
        {mode === 'MEMBER' ? (
          <Link
            href="/login/daftar"
            className="text-xs font-semibold text-primary-deep underline-offset-4 hover:underline"
          >
            Daftar member baru
          </Link>
        ) : null}
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        Masuk sebagai {roleLabel}
      </Button>

      {mode === 'MEMBER' ? (
        <LinkButton href="/" variant="ghost" className="w-full">
          Jelajahi dulu tanpa akun
        </LinkButton>
      ) : null}
    </form>
  );
}
