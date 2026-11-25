'use client';

import type { FormEvent } from 'react';
import { Send, X } from 'lucide-react';
import type { VolunteerApplicationValues } from '../hooks/use-volunteer-application';

interface VolunteerApplyModalProps {
  open: boolean;
  values: VolunteerApplicationValues;
  pending: boolean;
  onClose: () => void;
  onChange: (field: keyof VolunteerApplicationValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function VolunteerApplyModal({
  open,
  values,
  pending,
  onClose,
  onChange,
  onSubmit,
}: VolunteerApplyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Form Pendaftaran Volunteer</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Profesi / Jurusan Kuliah
            </label>
            <input
              type="text"
              placeholder="Contoh: Sastra Indonesia / Guru SD"
              value={values.majorOrJob}
              onChange={(e) => onChange('majorOrJob', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Instansi / Universitas
            </label>
            <input
              type="text"
              placeholder="Contoh: Universitas Indonesia"
              value={values.institution}
              onChange={(e) => onChange('institution', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilihan Divisi</label>
            <select
              value={values.division}
              onChange={(e) => onChange('division', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            >
              <option value="Kelas Cerita">Kelas Cerita &amp; Dongeng</option>
              <option value="Teknologi IT">Teknologi IT &amp; Inventaris</option>
              <option value="Bimbingan Baca">Bimbingan Belajar &amp; Baca</option>
              <option value="Sirkulasi Pos">Sirkulasi &amp; Pos Jaga</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Motivasi</label>
            <textarea
              rows={3}
              placeholder="Ceritakan motivasi Anda bergabung dengan Komunitas Rete Mali..."
              value={values.motivation}
              onChange={(e) => onChange('motivation', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            <span>{pending ? 'Mengirim...' : 'Kirim Berkas Pendaftaran'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
