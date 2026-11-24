'use client';

import { useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { useChangePassword } from '../hooks/use-change-password';

interface Notice {
  tone: 'success' | 'error';
  message: string;
}

export function PasswordChangeForm() {
  const { toast } = useToast();
  const password = useChangePassword();
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await password.submit();
    setNotice({ tone: result.ok ? 'success' : 'error', message: result.message });
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="member-current-password"
        label="Kata Sandi Saat Ini"
        type="password"
        autoComplete="current-password"
        value={password.form.currentPassword}
        onChange={(event) =>
          password.setField('currentPassword', event.target.value)
        }
      />
      <Input
        id="member-new-password"
        label="Kata Sandi Baru"
        type="password"
        autoComplete="new-password"
        hint="Minimal 8 karakter, memuat minimal 1 huruf kapital dan 1 angka."
        value={password.form.newPassword}
        onChange={(event) => password.setField('newPassword', event.target.value)}
      />
      <Input
        id="member-confirm-password"
        label="Konfirmasi Kata Sandi Baru"
        type="password"
        autoComplete="new-password"
        value={password.form.confirmPassword}
        onChange={(event) =>
          password.setField('confirmPassword', event.target.value)
        }
      />
      {notice ? (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-field border px-3 py-2.5 text-xs ${
            notice.tone === 'success'
              ? 'border-success/30 bg-green-50 text-success'
              : 'border-danger/30 bg-red-50 text-danger'
          }`}
        >
          {notice.tone === 'success' ? (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          )}
          <span>{notice.message}</span>
        </div>
      ) : null}
      <Button type="submit" loading={password.saving}>
        Perbarui Kata Sandi
      </Button>
    </form>
  );
}
