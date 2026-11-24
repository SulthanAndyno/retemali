'use client';

import { useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import {
  deleteBook,
  reserveBook,
  toggleBookmark as toggleBookmarkRequest,
} from '../api/books.api';
import type { BookActionResult, CatalogBook } from '../types/catalog.types';

export interface ToggleBookmarkResult extends BookActionResult {
  bookmarked?: boolean;
}

export interface UseBookMutationsResult {
  actionLoading: boolean;
  deletingId: string | null;
  toggleBookmark: (book: CatalogBook) => Promise<ToggleBookmarkResult>;
  reserve: (book: CatalogBook) => Promise<BookActionResult>;
  remove: (book: CatalogBook) => Promise<BookActionResult>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useBookMutations(): UseBookMutationsResult {
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleBookmark = async (book: CatalogBook): Promise<ToggleBookmarkResult> => {
    try {
      const response = await toggleBookmarkRequest(book.id);
      const bookmarked = response.data?.bookmarked ?? !book.isBookmarked;
      return {
        ok: true,
        bookmarked,
        message: bookmarked
          ? 'Buku disimpan ke daftar bacaan!'
          : 'Buku dihapus dari simpanan bacaan',
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal mengubah bookmark'),
      };
    }
  };

  const reserve = async (book: CatalogBook): Promise<BookActionResult> => {
    setActionLoading(true);
    try {
      await reserveBook(book.id);
      return {
        ok: true,
        message: `Peminjaman buku "${book.title}" berhasil diajukan! Berlaku 48 jam di Loket Sirkulasi.`,
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal mengajukan pinjaman'),
      };
    } finally {
      setActionLoading(false);
    }
  };

  const remove = async (book: CatalogBook): Promise<BookActionResult> => {
    setDeletingId(book.id);
    try {
      await deleteBook(book.id);
      return { ok: true, message: `Buku "${book.title}" berhasil dihapus` };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal menghapus buku'),
      };
    } finally {
      setDeletingId(null);
    }
  };

  return { actionLoading, deletingId, toggleBookmark, reserve, remove };
}
