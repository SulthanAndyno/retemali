'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/features/auth';
import { updateVolunteerProfile } from '../api/volunteer-profile.api';

export interface ProfileActionResult {
  ok: boolean;
  message: string;
}

export interface UseVolunteerProfileResult {
  name: string;
  phone: string;
  error: string | null;
  saving: boolean;
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  submit: () => Promise<ProfileActionResult>;
}

export function useVolunteerProfile(
  initialName: string,
  initialPhone: string
): UseVolunteerProfileResult {
  const { refreshUser } = useAuth();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (): Promise<ProfileActionResult> => {
    setError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      const message = 'Nama lengkap minimal 2 karakter.';
      setError(message);
      return { ok: false, message };
    }
    if (trimmedPhone.length < 8) {
      const message = 'Nomor WhatsApp/HP minimal 8 digit.';
      setError(message);
      return { ok: false, message };
    }

    setSaving(true);
    try {
      await updateVolunteerProfile({ name: trimmedName, phone: trimmedPhone });
      await refreshUser();
      return { ok: true, message: 'Profil berhasil diperbarui.' };
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : 'Gagal memperbarui profil. Coba lagi.';
      setError(message);
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  };

  return { name, phone, error, saving, setName, setPhone, submit };
}
