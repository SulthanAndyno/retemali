'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import type { PaginatedMeta } from '@/shared/types/api';
import { getGallery } from '../api/gallery.api';
import type { GalleryCategory, GalleryPhoto } from '../types/gallery.types';

export interface UsePublicGalleryResult {
  photos: GalleryPhoto[];
  meta: PaginatedMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  category: GalleryCategory | '';
  setPage: (page: number) => void;
  setCategory: (category: GalleryCategory | '') => void;
  reload: () => Promise<void>;
}

/** Daftar foto galeri publik (read-only) untuk halaman Dokumentasi Kegiatan. */
export function usePublicGallery(initialLimit = 12): UsePublicGalleryResult {
  const limit = initialLimit;

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [category, setCategoryState] = useState<GalleryCategory | ''>('');

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
          : 'Gagal memuat dokumentasi kegiatan.',
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

  return {
    photos,
    meta,
    loading,
    error,
    page,
    limit,
    category,
    setPage,
    setCategory,
    reload: load,
  };
}
