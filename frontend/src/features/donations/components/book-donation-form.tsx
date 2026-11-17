import type { FormEvent } from 'react';
import { Package } from 'lucide-react';
import type { DeliveryMethod } from '../types/donation.types';

interface BookDonationFormProps {
  packageTitle: string;
  totalBooks: number;
  conditionNote: string;
  deliveryMethod: DeliveryMethod;
  loading: boolean;
  onPackageTitleChange: (value: string) => void;
  onTotalBooksChange: (value: number) => void;
  onConditionNoteChange: (value: string) => void;
  onDeliveryMethodChange: (value: DeliveryMethod) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function BookDonationForm({
  packageTitle,
  totalBooks,
  conditionNote,
  deliveryMethod,
  loading,
  onPackageTitleChange,
  onTotalBooksChange,
  onConditionNoteChange,
  onDeliveryMethodChange,
  onSubmit,
}: BookDonationFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/70 space-y-3.5 text-xs"
    >
      <div>
        <label className="font-semibold text-slate-700 block mb-1">
          Judul / Kategori Paket Buku
        </label>
        <input
          type="text"
          placeholder="Contoh: 15 Buku Ensiklopedia & Cerita Rakyat"
          value={packageTitle}
          onChange={(event) => onPackageTitleChange(event.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Perkiraan Jumlah Buku
          </label>
          <input
            type="number"
            value={totalBooks}
            onChange={(event) => onTotalBooksChange(Number(event.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Metode Pengiriman
          </label>
          <select
            value={deliveryMethod}
            onChange={(event) =>
              onDeliveryMethodChange(event.target.value as DeliveryMethod)
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
          >
            <option value="DROP_OFF">Drop-off di Saung</option>
            <option value="COURIER">Kirim via Ekspedisi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold text-slate-700 block mb-1">
          Catatan Kondisi Fisik
        </label>
        <textarea
          rows={2}
          value={conditionNote}
          onChange={(event) => onConditionNoteChange(event.target.value)}
          placeholder="Catatan keutuhan halaman, cover, atau sasaran usia bacaan..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
      >
        <Package size={16} />
        <span>{loading ? 'Mendaftarkan...' : 'Kirim Pendataan Donasi Buku'}</span>
      </button>
    </form>
  );
}
