import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import {
  BOOK_AGE_GROUP_OPTIONS,
  BOOK_CATEGORY_OPTIONS,
} from '../lib/book-category';
import type { BookFormValues, CatalogBook } from '../types/catalog.types';
import { CoverUpload } from './cover-upload';

interface BookFormModalProps {
  open: boolean;
  editingBook: CatalogBook | null;
  form: BookFormValues;
  coverPreview: string | null;
  submitting: boolean;
  role: string | null | undefined;
  onChange: <K extends keyof BookFormValues>(
    field: K,
    value: BookFormValues[K]
  ) => void;
  onCoverChange: (file: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function BookFormModal({
  open,
  editingBook,
  form,
  coverPreview,
  submitting,
  role,
  onChange,
  onCoverChange,
  onClose,
  onSubmit,
}: BookFormModalProps) {
  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {editingBook ? 'Edit Data Koleksi Buku' : 'Tambah Buku Baru'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {role === 'ADMIN'
                ? 'Akses Penuh Administrator (CRUD)'
                : 'Akses Operasional Volunteer (CRU)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Judul Buku *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Filosofi Teras"
              value={form.title}
              onChange={(event) => onChange('title', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Penulis *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Henry Manampiring"
                value={form.author}
                onChange={(event) => onChange('author', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kategori Buku *</label>
              <select
                value={form.category}
                onChange={(event) =>
                  onChange('category', event.target.value as BookFormValues['category'])
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BOOK_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Penjenjangan Usia
            </label>
            <select
              value={form.ageGroup}
              onChange={(event) =>
                onChange(
                  'ageGroup',
                  event.target.value as BookFormValues['ageGroup']
                )
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Belum ditentukan</option>
              {BOOK_AGE_GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Lokasi Rak Fisik *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rak B-04"
                value={form.shelfLocation}
                onChange={(event) => onChange('shelfLocation', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Stok *</label>
              <input
                type="number"
                min={1}
                required
                value={form.totalStock}
                onChange={(event) => onChange('totalStock', Number(event.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Penerbit</label>
              <input
                type="text"
                placeholder="Contoh: Gramedia"
                value={form.publisher}
                onChange={(event) => onChange('publisher', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ISBN</label>
              <input
                type="text"
                placeholder="Contoh: 978602..."
                value={form.isbn}
                onChange={(event) => onChange('isbn', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Sinopsis / Ringkasan
            </label>
            <textarea
              rows={3}
              placeholder="Ceritakan ringkasan isi buku, keunggulan bacaan, atau kelompok pembaca yang cocok..."
              value={form.synopsis}
              onChange={(event) => onChange('synopsis', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <CoverUpload preview={coverPreview} onSelect={onCoverChange} />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
            >
              {submitting
                ? 'Menyimpan...'
                : editingBook
                  ? 'Simpan Perubahan'
                  : 'Tambah ke Katalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
