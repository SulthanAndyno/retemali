'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { WhatsAppButton } from '@/shared/components/ui/whatsapp-button';
import { get } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';

interface PublicContactSetting {
  siteName?: string;
  phone?: string;
  email?: string;
  openDays?: string;
  openHours?: string;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [contact, setContact] = useState<PublicContactSetting | null>(null);

  useEffect(() => {
    let active = true;
    get<ApiEnvelope<PublicContactSetting>>('/settings')
      .then((res) => {
        if (active) setContact(res.data ?? null);
      })
      .catch(() => {
        if (active) setContact(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = email.trim().toLowerCase();

    if (!cleaned || !cleaned.includes('@') || cleaned.includes(' ')) {
      setError('Masukkan alamat email yang valid.');
      setSubmittedEmail(null);
      return;
    }

    setError(null);
    setSubmittedEmail(cleaned);
  };

  const whatsappMessage = submittedEmail
    ? `Halo Pengelola ${contact?.siteName ?? 'Rete Mali'}, saya ingin meminta reset kata sandi / pemulihan email akun saya.\n\nEmail terdaftar: ${submittedEmail}\nMohon dibantu proses verifikasi dan resetnya. Terima kasih.`
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="lupa-password-email"
        label="Alamat Email Akun Anda"
        type="email"
        autoComplete="email"
        placeholder="nama.pengguna@contoh-email.id"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={error}
      />

      <Button type="submit" className="w-full">
        Siapkan Permintaan Pemulihan
      </Button>

      {submittedEmail ? (
        <div
          role="status"
          className="space-y-3 rounded-field border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-ink"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
              aria-hidden
            />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-900">
                Pesan pemulihan siap dikirim ke Admin
              </p>
              <p className="text-ink-soft">
                Klik tombol WhatsApp di bawah untuk mengirim permintaan reset akun{' '}
                <span className="font-mono font-semibold text-ink">
                  {submittedEmail}
                </span>
                . Admin akan mereset kata sandi sementara atau memperbarui email
                Anda melalui Manajemen Member.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <WhatsAppButton
              phone={contact?.phone}
              message={whatsappMessage}
              label="Kirim ke WhatsApp Admin"
              size="sm"
            />
            {contact?.email ? (
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  'Permintaan Reset Akun ReteMali'
                )}&body=${encodeURIComponent(whatsappMessage)}`}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-surface"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {contact.email}
              </a>
            ) : null}
          </div>

          {contact?.openDays || contact?.openHours ? (
            <p className="text-[11px] text-ink-soft">
              Jam layanan pengelola: {[contact.openDays, contact.openHours].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-xs text-ink-soft">
          Reset kata sandi dan perubahan email diproses oleh Admin ReteMali demi
          keamanan akun komunitas.
        </p>
      )}
    </form>
  );
}
