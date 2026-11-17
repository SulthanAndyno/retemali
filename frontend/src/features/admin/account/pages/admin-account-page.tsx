'use client';

import { KeyRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { useChangePassword } from '../hooks/use-change-password';

export function AdminAccountPage() {
  const { toast } = useToast();
  const password = useChangePassword();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await password.submit();
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Pengaturan Akun"
        description="Perbarui kata sandi administrator."
      />
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="current-password"
            type="password"
            label="Kata sandi saat ini"
            value={password.form.currentPassword}
            onChange={(event) =>
              password.setField('currentPassword', event.target.value)
            }
            required
          />
          <Input
            id="new-password"
            type="password"
            label="Kata sandi baru"
            hint="Minimal 8 karakter, memuat huruf besar dan angka."
            value={password.form.newPassword}
            onChange={(event) => password.setField('newPassword', event.target.value)}
            required
          />
          <Input
            id="confirm-password"
            type="password"
            label="Konfirmasi kata sandi baru"
            value={password.form.confirmPassword}
            onChange={(event) =>
              password.setField('confirmPassword', event.target.value)
            }
            required
          />
          {password.error ? (
            <p className="rounded-field border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
              {password.error}
            </p>
          ) : null}
          <Button type="submit" loading={password.saving}>
            <KeyRound className="h-4 w-4" aria-hidden />
            Simpan Kata Sandi
          </Button>
        </form>
      </Card>
    </div>
  );
}
