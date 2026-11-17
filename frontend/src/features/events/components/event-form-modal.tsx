import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { EVENT_CATEGORY_OPTIONS } from '../lib/event-options';
import type { EventFormValues, EventItem } from '../types/event.types';
import { BannerUpload } from './banner-upload';

interface EventFormModalProps {
  open: boolean;
  editingEvent: EventItem | null;
  form: EventFormValues;
  bannerPreview: string | null;
  submitting: boolean;
  quotaFloor: number;
  onChange: <K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K]
  ) => void;
  onBannerChange: (file: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function EventFormModal({
  open,
  editingEvent,
  form,
  bannerPreview,
  submitting,
  quotaFloor,
  onChange,
  onBannerChange,
  onClose,
  onSubmit,
}: EventFormModalProps) {
  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <h3 className="text-base font-extrabold text-slate-900">
            {editingEvent ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Judul Acara / Kegiatan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Festival Dongeng Akhir Pekan"
              value={form.title}
              onChange={(event) => onChange('title', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kategori *</label>
              <select
                value={form.category}
                onChange={(event) =>
                  onChange('category', event.target.value as EventFormValues['category'])
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EVENT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kuota Peserta *</label>
              <input
                type="number"
                min={quotaFloor}
                required
                value={form.quota}
                onChange={(event) => onChange('quota', Number(event.target.value))}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 ${
                  form.quota < quotaFloor
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {editingEvent && editingEvent.registeredCount > 0 && (
                <p
                  className={`text-[10px] mt-1 leading-snug ${
                    form.quota < quotaFloor
                      ? 'text-rose-600 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {form.quota < quotaFloor
                    ? `Kuota tidak boleh di bawah ${quotaFloor} (peserta terdaftar).`
                    : `${editingEvent.registeredCount} peserta sudah terdaftar. Sisa ${
                        form.quota - editingEvent.registeredCount
                      } kursi.`}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Fasilitator / Pemateri *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kak Dini & Tim Teater Boneka"
              value={form.facilitatorName}
              onChange={(event) => onChange('facilitatorName', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Lokasi Pelaksanaan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Saung Rete Mali, Jatirangga"
              value={form.location}
              onChange={(event) => onChange('location', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tanggal *</label>
              <input
                type="date"
                required
                value={form.eventDate}
                onChange={(event) => onChange('eventDate', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mulai *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(event) => onChange('startTime', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Selesai *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(event) => onChange('endTime', event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Biaya Acara</label>
              <select
                value={form.feeType}
                onChange={(event) =>
                  onChange('feeType', event.target.value as EventFormValues['feeType'])
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FREE">Gratis (Free)</option>
                <option value="INFAQ">Infaq Sukarela</option>
              </select>
            </div>
            {form.feeType === 'INFAQ' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Saran Infaq (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.infaqAmount}
                  onChange={(event) => onChange('infaqAmount', Number(event.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Deskripsi Kegiatan *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ceritakan detail kegiatan, kelompok usia sasaran, dan materi seru yang akan dipelajari..."
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <BannerUpload preview={bannerPreview} onSelect={onBannerChange} />

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
                : editingEvent
                  ? 'Simpan Perubahan'
                  : 'Terbitkan Acara'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
