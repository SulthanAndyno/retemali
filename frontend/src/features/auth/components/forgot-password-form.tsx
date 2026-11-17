'use client';

import { useState, type FormEvent } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!email.includes('@') || email.includes(' ')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    setError(null);
    setNotice(
      'Fitur pemulihan kata sandi belum tersedia. Hubungi pengelola ReteMali untuk proses reset manual.'
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="lupa-password-email"
        label="Alamat Email Akun Anda"
        type="email"
        autoComplete="email"
        placeholder="nama.pengguna@contoh-email.test"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={error}
      />

      {notice ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-field border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-[#8a5807]"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{notice}</span>
        </div>
      ) : null}

      <Button type="submit" className="w-full">
        Kirim Tautan Pemulihan
      </Button>
      <p className="text-center text-xs text-ink-soft">
        Fitur pemulihan mandiri belum aktif. Jika membutuhkan bantuan, hubungi
        pengelola ReteMali.
      </p>
    </form>
  );
}
