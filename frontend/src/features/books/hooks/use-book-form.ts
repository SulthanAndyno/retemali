'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getImageUrl } from '@/shared/lib/utils';
import { createBook, updateBook } from '../api/books.api';
import type { BookActionResult, BookFormValues, CatalogBook } from '../types/catalog.types';

const EMPTY_FORM: BookFormValues = {
  title: '',
  author: '',
  category: 'FIKSI_SASTRA',
  ageGroup: '',
  shelfLocation: 'Rak B-04',
  totalStock: 3,
  publisher: '',
  isbn: '',
  synopsis: '',
};

export interface UseBookFormResult {
  formOpen: boolean;
  editingBook: CatalogBook | null;
  form: BookFormValues;
  coverPreview: string | null;
  submitting: boolean;
  openCreate: () => void;
  openEdit: (book: CatalogBook) => void;
  close: () => void;
  setField: <K extends keyof BookFormValues>(
    field: K,
    value: BookFormValues[K]
  ) => void;
  selectCover: (file: File | null) => void;
  submit: () => Promise<BookActionResult>;
}

interface UseBookFormOptions {
  canCreate: boolean;
  onSaved: () => void | Promise<void>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useBookForm({ canCreate, onSaved }: UseBookFormOptions): UseBookFormResult {
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<CatalogBook | null>(null);
  const [form, setForm] = useState<BookFormValues>(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const revokePreview = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  useEffect(() => {
    return () => {
      revokePreview();
    };
  }, []);

  const reset = () => {
    revokePreview();
    setEditingBook(null);
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const openEdit = (book: CatalogBook) => {
    revokePreview();
    setEditingBook(book);
    setForm({
      title: book.title ?? '',
      author: book.author ?? '',
      category: book.category ?? 'FIKSI_SASTRA',
      ageGroup: book.ageGroup ?? '',
      shelfLocation: book.shelfLocation ?? 'Rak B-04',
      totalStock: book.totalStock || 1,
      publisher: book.publisher ?? '',
      isbn: book.isbn ?? '',
      synopsis: book.synopsis ?? '',
    });
    setCoverFile(null);
    setCoverPreview(book.coverImage ? getImageUrl(book.coverImage) : null);
    setFormOpen(true);
  };

  const close = () => {
    setFormOpen(false);
    reset();
  };

  const setField = <K extends keyof BookFormValues>(
    field: K,
    value: BookFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const selectCover = (file: File | null) => {
    revokePreview();
    setCoverFile(file);
    if (!file) {
      setCoverPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setCoverPreview(objectUrl);
  };

  const submit = async (): Promise<BookActionResult> => {
    if (!editingBook && !canCreate) {
      return {
        ok: false,
        message: 'Hanya admin yang dapat menambahkan koleksi buku baru',
      };
    }
    if (!form.title.trim()) {
      return { ok: false, message: 'Judul buku wajib diisi' };
    }
    if (form.author.trim().length < 2) {
      return { ok: false, message: 'Nama penulis minimal 2 karakter' };
    }
    if (!form.shelfLocation.trim()) {
      return { ok: false, message: 'Lokasi rak wajib diisi' };
    }

    const wasEditing = Boolean(editingBook);
    setSubmitting(true);

    try {
      if (editingBook) {
        await updateBook(editingBook.id, form, coverFile);
      } else {
        await createBook(form, coverFile);
      }
      await onSaved();
      close();
      return {
        ok: true,
        message: wasEditing
          ? 'Data buku berhasil diperbarui!'
          : 'Buku baru berhasil ditambahkan ke katalog!',
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal menyimpan buku'),
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formOpen,
    editingBook,
    form,
    coverPreview,
    submitting,
    openCreate,
    openEdit,
    close,
    setField,
    selectCover,
    submit,
  };
}
