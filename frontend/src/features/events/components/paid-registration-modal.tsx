import { CheckCircle2, Ticket, X } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import type { EventItem } from '../types/event.types';
import { ProofUpload } from './proof-upload';

interface PaidRegistrationModalProps {
  event: EventItem | null;
  proofFile: File | null;
  proofPreview: string | null;
  registering: boolean;
  onSelectProof: (file: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function PaidRegistrationModal({
  event,
  proofFile,
  proofPreview,
  registering,
  onSelectProof,
  onClose,
  onSubmit,
}: PaidRegistrationModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-start justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Pendaftaran Kegiatan Berbayar
            </h3>
            <p className="text-[11px] text-slate-500">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
          <p className="font-bold text-amber-900 flex items-center gap-1.5">
            <Ticket size={14} />
            Pembayaran Tiket Masuk: {formatCurrency(Number(event.ticketPrice ?? 0))}
          </p>
          <p className="text-[11px] text-amber-800 leading-snug">
            Silakan transfer ke rekening/QRIS resmi Rete Mali (lihat halaman Donasi),
            lalu unggah bukti pembayaran di bawah ini. E-Tiket aktif setelah admin
            memverifikasi bukti tersebut.
          </p>
        </div>

        <ProofUpload file={proofFile} preview={proofPreview} onSelect={onSelectProof} />

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!proofFile || registering}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={15} />
            {registering ? 'Mengirim...' : 'Kirim & Daftar'}
          </button>
        </div>
      </div>
    </div>
  );
}
