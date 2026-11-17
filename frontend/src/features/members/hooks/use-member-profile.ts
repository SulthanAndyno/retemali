'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/features/auth';
import { updateMemberProfile } from '../api/member.api';

export interface ProfileActionResult {
  ok: boolean;
  message: string;
}

export interface UseMemberProfileResult {
  name: string;
  phone: string;
  saving: boolean;
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  submit: () => Promise<ProfileActionResult>;
}

export function useMemberProfile(
  initialName: string,
  initialPhone: string
): UseMemberProfileResult {
  const { refreshUser } = useAuth();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

  const submit = async (): Promise<ProfileActionResult> => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      return { ok: false, message: 'Nama lengkap minimal 2 karakter.' };
    }
    if (trimmedPhone.length < 8) {
      return { ok: false, message: 'Nomor WhatsApp/HP minimal 8 digit.' };
    }

    setSaving(true);
    try {
      await updateMemberProfile({ name: trimmedName, phone: trimmedPhone });
      await refreshUser();
      return { ok: true, message: 'Profil berhasil diperbarui.' };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Gagal memperbarui profil. Coba lagi.';
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  };

  return { name, phone, saving, setName, setPhone, submit };
}
