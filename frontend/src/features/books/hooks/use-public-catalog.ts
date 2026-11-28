'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getPublicBooks, type PublicBookSort } from '../api/books.api';
import type { BookAgeGroup } from '../types/book.types';
import type { CatalogBook } from '../types/catalog.types';

interface UsePublicCatalogParams {
  search: string;
  category: string;
  ageGroup: BookAgeGroup | 'ALL';
  availableOnly: boolean;
  sortBy: PublicBookSort;
  page: number;
}

export interface UsePublicCatalogResult {
  books: CatalogBook[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat katalog buku.';
}

function sortBooks(books: CatalogBook[], sortBy: PublicBookSort) {
  if (sortBy !== 'title-asc' && sortBy !== 'title-desc') return books;

  return [...books].sort((a, b) =>
    sortBy === 'title-asc'
      ? a.title.localeCompare(b.title, 'id')
      : b.title.localeCompare(a.title, 'id')
  );
}

export function usePublicCatalog({
  search,
  category,
  ageGroup,
  availableOnly,
  sortBy,
  page,
}: UsePublicCatalogParams): UsePublicCatalogResult {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getPublicBooks({
        page,
        search,
        category,
        ageGroup,
        availableOnly,
        sortBy,
      });
      if (requestId !== requestIdRef.current) return;

      setBooks(sortBooks(response.data ?? [], sortBy));
      setTotal(response.meta?.total ?? 0);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setBooks([]);
      setTotal(0);
      setTotalPages(1);
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [ageGroup, availableOnly, category, page, search, sortBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { books, total, totalPages, loading, error, reload: load };
}
