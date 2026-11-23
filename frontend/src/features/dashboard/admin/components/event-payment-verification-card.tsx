import { BadgeCheck, Eye, Receipt, XCircle } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import type { EventPaymentRegistration } from '../types/admin.types';

interface EventPaymentVerificationCardProps {
  registrations: EventPaymentRegistration[];
  loading: boolean;
  error: string | null;
  verifyingId: string | null;
  onReload: () => void;
  onOpenProof: (paymentProofUrl: string | null) => void;
  onVerify: (id: string, status: 'VERIFIED' | 'FAILED') => void;
}

export function EventPaymentVerificationCard({
  registrations,
  loading,
  error,
  verifyingId,
  onReload,
  onOpenProof,
  onVerify,
}: EventPaymentVerificationCardProps) {
  const pendingCount = registrations.filter(
    (row) => row.paymentStatus === 'PENDING'
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-emerald-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Verifikasi Pembayaran Kegiatan</h2>
        </div>
        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
          {pendingCount} Menunggu
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        Bukti pembayaran peserta kegiatan berbayar. Setujui untuk mengaktifkan E-Tiket, atau
        tolak untuk membatalkan pendaftaran.
      </p>

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-xs text-rose-700">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="text-[10px] font-bold text-rose-700 hover:underline shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      ) : registrations.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          Tidak ada pendaftaran kegiatan berbayar
        </p>
      ) : (
        <div className="space-y-2">
          {registrations.map((row) => (
            <div
              key={row.id}
              className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{row.user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{row.event.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{row.ticketCode}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-emerald-700">
                    {formatCurrency(Number(row.event.ticketPrice ?? 0))}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      row.paymentStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : row.paymentStatus === 'FAILED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {row.paymentStatus ?? 'GRATIS'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenProof(row.paymentProofUrl)}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1"
                >
                  <Eye size={11} /> Lihat Bukti
                </button>
                <button
                  type="button"
                  onClick={() => onVerify(row.id, 'VERIFIED')}
                  disabled={verifyingId === row.id || row.paymentStatus === 'VERIFIED'}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <BadgeCheck size={11} /> Setujui
                </button>
                <button
                  type="button"
                  onClick={() => onVerify(row.id, 'FAILED')}
                  disabled={verifyingId === row.id || row.paymentStatus === 'FAILED'}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <XCircle size={11} /> Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
