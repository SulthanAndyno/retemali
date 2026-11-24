'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getSiteSetting, updateSiteSetting } from '../api/settings.api';
import type {
  SiteSetting,
  SiteSettingField,
  SiteSettingFormValues,
} from '../types/settings.types';

const EMPTY_FORM: SiteSettingFormValues = {
  siteName: '',
  tagline: '',
  address: '',
  phone: '',
  email: '',
  mapsUrl: '',
  instagramUrl: '',
  openDays: '',
  openHours: '',
  donationInstructions: '',
};

function toFormValues(setting: SiteSetting): SiteSettingFormValues {
  return {
    siteName: setting.siteName,
    tagline: setting.tagline,
    address: setting.address,
    phone: setting.phone,
    email: setting.email,
    mapsUrl: setting.mapsUrl ?? '',
    instagramUrl: setting.instagramUrl ?? '',
    openDays: setting.openDays,
    openHours: setting.openHours,
    donationInstructions: setting.donationInstructions ?? '',
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

/** Validasi sisi klien supaya kesalahan form tampil di bawah field terkait. */
function validate(form: SiteSettingFormValues) {
  const errors: Partial<Record<SiteSettingField, string>> = {};

  if (!form.siteName.trim()) errors.siteName = 'Nama situs wajib diisi';
  if (!form.address.trim()) errors.address = 'Alamat wajib diisi';
  if (!form.phone.trim()) errors.phone = 'Nomor telepon wajib diisi';
  if (!form.email.trim()) errors.email = 'Email wajib diisi';
  else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Format email tidak valid';
  }
  if (form.mapsUrl.trim() && !URL_PATTERN.test(form.mapsUrl.trim())) {
    errors.mapsUrl = 'URL harus diawali http:// atau https://';
  }
  if (form.instagramUrl.trim() && !URL_PATTERN.test(form.instagramUrl.trim())) {
    errors.instagramUrl = 'URL harus diawali http:// atau https://';
  }

  return errors;
}

export type SaveResult = { ok: true; message: string } | { ok: false; message: string };

export interface UseSiteSettingsResult {
  form: SiteSettingFormValues;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fieldErrors: Partial<Record<SiteSettingField, string>>;
  dirty: boolean;
  updatedAt: string | null;
  updateField: (field: SiteSettingField, value: string) => void;
  reload: () => Promise<void>;
  reset: () => void;
  save: () => Promise<SaveResult>;
}

export function useSiteSettings(): UseSiteSettingsResult {
  const [form, setForm] = useState<SiteSettingFormValues>(EMPTY_FORM);
  const [initial, setInitial] = useState<SiteSettingFormValues>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<SiteSettingField, string>>
  >({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSiteSetting();
      const values = toFormValues(response.data);
      setForm(values);
      setInitial(values);
      setUpdatedAt(response.data.updatedAt);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Gagal memuat pengaturan website.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const updateField = useCallback((field: SiteSettingField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setForm(initial);
    setFieldErrors({});
  }, [initial]);

  const save = useCallback(async (): Promise<SaveResult> => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return { ok: false, message: 'Periksa kembali kolom yang ditandai merah.' };
    }

    setSaving(true);
    try {
      const response = await updateSiteSetting(form);
      const values = toFormValues(response.data);
      setForm(values);
      setInitial(values);
      setUpdatedAt(response.data.updatedAt);
      setFieldErrors({});
      return {
        ok: true,
        message: response.message ?? 'Pengaturan website berhasil disimpan.',
      };
    } catch (caught) {
      if (caught instanceof ApiError) {
        return { ok: false, message: caught.message };
      }
      return { ok: false, message: 'Gagal menyimpan pengaturan website.' };
    } finally {
      setSaving(false);
    }
  }, [form]);

  const dirty =
    (Object.keys(form) as SiteSettingField[]).some(
      (field) => form[field] !== initial[field]
    );

  return {
    form,
    loading,
    saving,
    error,
    fieldErrors,
    dirty,
    updatedAt,
    updateField,
    reload: load,
    reset,
    save,
  };
}
