'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { patch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function AdminAccountPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<PasswordForm>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (field: keyof PasswordForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (form.newPassword.length < 8) {
      setError('Kata sandi baru minimal 8 karakter.');
      return;
    }
    if (!/[A-Z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)) {
      setError('Kata sandi baru harus memuat huruf besar dan angka.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSaving(true);
    try {
      await patch('/auth/change-password', form);
      setForm(EMPTY);
      toast('Kata sandi berhasil diperbarui.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui kata sandi.');
    } finally {
      setSaving(false);
    }
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
            value={form.currentPassword}
            onChange={(event) => setField('currentPassword', event.target.value)}
            required
          />
          <Input
            id="new-password"
            type="password"
            label="Kata sandi baru"
            hint="Minimal 8 karakter, memuat huruf besar dan angka."
            value={form.newPassword}
            onChange={(event) => setField('newPassword', event.target.value)}
            required
          />
          <Input
            id="confirm-password"
            type="password"
            label="Konfirmasi kata sandi baru"
            value={form.confirmPassword}
            onChange={(event) => setField('confirmPassword', event.target.value)}
            required
          />
          {error ? (
            <p className="rounded-field border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={saving}>
            <KeyRound className="h-4 w-4" aria-hidden />
            Simpan Kata Sandi
          </Button>
        </form>
      </Card>
    </div>
  );
}
