'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import type { PaginatedMeta } from '@/shared/types/api';
import {
  deleteGalleryPhoto,
  getGallery,
  importFromGoogleDrive,
  updateGalleryPhoto,
} from '../api/gallery.api';
import type {
  GalleryCategory,
  GalleryFormValues,
  GalleryPhoto,
} from '../types/gallery.types';

export const EMPTY_GALLERY_FORM: GalleryFormValues = {
  driveUrl: '',
  title: '',
  category: 'KEGIATAN',
  caption: '',
  location: 'Saung Baca Rete Mali, Jatirangga',
  isFeatured: false,
};

export type GalleryFormField = keyof GalleryFormValues;

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const DRIVE_URL_PATTERN = /^https?:\/\/(drive|docs)\.google\.com\//i;
const DRIVE_ID_PATTERN = /^[a-zA-Z0-9_-]{25,50}$/;

/** Validasi klien: link Drive wajib, field lain opsional. */
function validate(form: GalleryFormValues) {
  const errors: Partial<Record<GalleryFormField, string>> = {};
  const drive = form.driveUrl.trim();

  if (!drive) {
    errors.driveUrl = 'Link Google Drive wajib diisi';
  } else if (!DRIVE_URL_PATTERN.test(drive) && !DRIVE_ID_PATTERN.test(drive)) {
    errors.driveUrl =
      'Gunakan link Google Drive (https://drive.google.com/...) atau ID file';
  }

  if (form.title.trim() && form.title.trim().length < 3) {
    errors.title = 'Judul minimal 3 karakter';
  }

  return errors;
}

export interface UseAdminGalleryResult {
  photos: GalleryPhoto[];
  meta: PaginatedMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  category: GalleryCategory | '';
  form: GalleryFormValues;
  fieldErrors: Partial<Record<GalleryFormField, string>>;
  saving: boolean;
  deletingId: string | null;
  togglingId: string | null;
  setPage: (page: number) => void;
  setCategory: (category: GalleryCategory | '') => void;
  updateField: <K extends GalleryFormField>(
    field: K,
    value: GalleryFormValues[K],
  ) => void;
  resetForm: () => void;
  reload: () => Promise<void>;
  submit: () => Promise<ActionResult>;
  remove: (photo: GalleryPhoto) => Promise<ActionResult>;
  toggleFeatured: (photo: GalleryPhoto) => Promise<ActionResult>;
}

interface UseAdminGalleryOptions {
  initialPage?: number;
  initialLimit?: number;
  initialCategory?: GalleryCategory | '';
}

export function useAdminGallery(
  options: UseAdminGalleryOptions = {},
): UseAdminGalleryResult {
  const limit = options.initialLimit ?? 12;

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(options.initialPage ?? 1);
  const [category, setCategoryState] = useState<GalleryCategory | ''>(
    options.initialCategory ?? '',
  );

  const [form, setForm] = useState<GalleryFormValues>(EMPTY_GALLERY_FORM);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<GalleryFormField, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getGallery({ page, limit, category });
      if (requestId !== requestIdRef.current) return;
      setPhotos(response.data ?? []);
      setMeta(response.meta ?? null);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setPhotos([]);
      setMeta(null);
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : 'Gagal memuat foto galeri.',
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, next));
  }, []);

  const setCategory = useCallback((next: GalleryCategory | '') => {
    setCategoryState(next);
    setPageState(1);
  }, []);

  const updateField = useCallback(
    <K extends GalleryFormField>(field: K, value: GalleryFormValues[K]) => {
      setForm((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const resetForm = useCallback(() => {
    setForm(EMPTY_GALLERY_FORM);
    setFieldErrors({});
  }, []);

  const submit = useCallback(async (): Promise<ActionResult> => {
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return { ok: false, message: 'Periksa kembali link dan isian form.' };
    }

    setSaving(true);
    try {
      const response = await importFromGoogleDrive(form);
      setForm(EMPTY_GALLERY_FORM);
      if (page !== 1) {
        setPageState(1);
      } else {
        await load();
      }
      const count = response.data?.importedCount ?? 0;
      return {
        ok: true,
        message:
          count > 0
            ? `${count} foto berhasil ditambahkan dari Google Drive.`
            : 'Link ini sudah pernah ditambahkan sebelumnya.',
      };
    } catch (caught) {
      return {
        ok: false,
        message:
          caught instanceof ApiError
            ? caught.message
            : 'Gagal menambahkan foto dari Google Drive.',
      };
    } finally {
      setSaving(false);
    }
  }, [form, page, load]);

  const remove = useCallback(
    async (photo: GalleryPhoto): Promise<ActionResult> => {
      setDeletingId(photo.id);
      try {
        await deleteGalleryPhoto(photo.id);
        if (photos.length === 1 && page > 1) {
          setPageState(page - 1);
        } else {
          await load();
        }
        return { ok: true, message: 'Foto galeri berhasil dihapus.' };
      } catch (caught) {
        return {
          ok: false,
          message:
            caught instanceof ApiError
              ? caught.message
              : 'Gagal menghapus foto galeri.',
        };
      } finally {
        setDeletingId(null);
      }
    },
    [photos.length, page, load],
  );

  const toggleFeatured = useCallback(
    async (photo: GalleryPhoto): Promise<ActionResult> => {
      setTogglingId(photo.id);
      try {
        await updateGalleryPhoto(photo.id, { isFeatured: !photo.isFeatured });
        await load();
        return {
          ok: true,
          message: photo.isFeatured
            ? 'Foto dilepas dari unggulan.'
            : 'Foto ditandai sebagai unggulan.',
        };
      } catch (caught) {
        return {
          ok: false,
          message:
            caught instanceof ApiError
              ? caught.message
              : 'Gagal mengubah status unggulan.',
        };
      } finally {
        setTogglingId(null);
      }
    },
    [load],
  );

  return {
    photos,
    meta,
    loading,
    error,
    page,
    limit,
    category,
    form,
    fieldErrors,
    saving,
    deletingId,
    togglingId,
    setPage,
    setCategory,
    updateField,
    resetForm,
    reload: load,
    submit,
    remove,
    toggleFeatured,
  };
}
