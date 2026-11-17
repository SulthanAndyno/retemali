'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getBookById } from '../api/books.api';
import type { Book } from '../types/book.types';

export interface UseBookDetailResult {
  book: Book | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat detail buku.';
}

export function useBookDetail(identifier: string): UseBookDetailResult {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getBookById(identifier);
      if (requestId !== requestIdRef.current) return;
      setBook(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setBook(null);
      setError(errorMessage(loadError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { book, loading, error, reload: load };
}
