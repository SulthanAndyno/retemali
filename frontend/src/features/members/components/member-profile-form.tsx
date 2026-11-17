'use client';

import { useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { useMemberProfile } from '../hooks/use-member-profile';

interface MemberProfileFormProps {
  name: string;
  phone: string;
  email: string;
}

interface Notice {
  tone: 'success' | 'error';
  message: string;
}

export function MemberProfileForm({
  name: initialName,
  phone: initialPhone,
  email,
}: MemberProfileFormProps) {
  const { toast } = useToast();
  const profile = useMemberProfile(initialName, initialPhone);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await profile.submit();
    setNotice({ tone: result.ok ? 'success' : 'error', message: result.message });
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="member-email"
        label="Alamat Email (tidak dapat diubah)"
        type="email"
        value={email}
        disabled
        hint="Email adalah identitas akun; untuk perubahan email silakan hubungi pengelola."
      />
      <Input
        id="member-name"
        label="Nama Lengkap"
        autoComplete="name"
        value={profile.name}
        onChange={(event) => profile.setName(event.target.value)}
      />
      <Input
        id="member-phone"
        label="Nomor WhatsApp/HP"
        type="tel"
        autoComplete="tel"
        value={profile.phone}
        onChange={(event) => profile.setPhone(event.target.value)}
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
      <Button type="submit" loading={profile.saving}>
        Simpan Perubahan Profil
      </Button>
    </form>
  );
}
