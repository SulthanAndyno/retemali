'use client';

import { useState } from 'react';
import { Loader2, Ticket } from 'lucide-react';
import { getTicketCredential, TicketCredentialModal } from '@/features/events';
import type { TicketCredential } from '@/features/events';

interface TicketCredentialButtonProps {
  ticketCode: string;
  label?: string;
  className?: string;
}

/**
 * Membuka kredensial E-Tiket milik peserta (nama, jadwal, kode, status
 * pembayaran, waktu verifikasi WIB) dengan tombol cetak / simpan PDF.
 * Data diambil ulang dari server supaya status pembayaran yang tampil
 * adalah status terbaru, bukan snapshot saat daftar.
 */
export function TicketCredentialButton({
  ticketCode,
  label = 'Lihat E-Tiket',
  className,
}: TicketCredentialButtonProps) {
  const [credential, setCredential] = useState<TicketCredential | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketCredential(ticketCode);
      const next = response.data?.ticketCredential ?? null;
      if (!next) {
        setError('Kredensial E-Tiket tidak ditemukan pada respons server.');
        return;
      }
      setCredential(next);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Gagal memuat kredensial E-Tiket.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void open()}
        disabled={loading}
        className={
          className ??
          'inline-flex items-center gap-1.5 rounded-lg border border-primary-deep/20 px-2.5 py-1 text-[11px] font-semibold text-primary-deep hover:bg-surface-blue/40 disabled:opacity-60'
        }
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <Ticket className="h-3.5 w-3.5" aria-hidden />
        )}
        {loading ? 'Memuat...' : label}
      </button>

      {error ? <p className="text-[11px] text-danger">{error}</p> : null}

      <TicketCredentialModal
        open={Boolean(credential)}
        credential={credential}
        onClose={() => setCredential(null)}
      />
    </>
  );
}
