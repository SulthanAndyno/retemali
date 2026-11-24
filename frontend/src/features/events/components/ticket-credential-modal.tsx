'use client';

import { CheckCircle2, Copy, Printer, Ticket, X } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import type { TicketCredential } from '../types/event.types';

interface TicketCredentialModalProps {
  open: boolean;
  credential: TicketCredential | null;
  onClose: () => void;
  onCopyCode?: (code: string) => void;
}

const STATUS_TONE: Record<string, { box: string; text: string; label: string }> = {
  ACTIVE_VALID: {
    box: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    label: 'E-Tiket aktif dan sah',
  },
  PENDING_PAYMENT_VERIFICATION: {
    box: 'bg-amber-50 border-amber-200',
    text: 'text-amber-900',
    label: 'Menunggu verifikasi pembayaran admin',
  },
  USED_CHECKED_IN: {
    box: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    label: 'Sudah check-in di lokasi kegiatan',
  },
  INVALID_OR_REJECTED: {
    box: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    label: 'E-Tiket tidak berlaku',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Mencetak / menyimpan E-Tiket sebagai PDF lewat jendela cetak browser.
 * Dokumen dibuat mandiri supaya hasil cetak tidak terpengaruh layout aplikasi.
 */
function printCredential(credential: TicketCredential) {
  const rows: Array<[string, string]> = [
    ['Nama Peserta', credential.participantName ?? '-'],
    ['Nomor Anggota', credential.participantCode ?? '-'],
    ['Kegiatan', credential.eventTitle ?? '-'],
    ['Jadwal', credential.eventScheduleWib ?? credential.eventDateWib ?? '-'],
    ['Lokasi', credential.eventLocation ?? '-'],
    ['Kode E-Tiket', credential.ticketCode],
    ['Harga Tiket Masuk', formatCurrency(credential.ticketPrice)],
    ['Status Pembayaran', credential.paymentStatusLabel],
    ['Diverifikasi Pada', credential.verifiedAtWib ?? '-'],
    ['Tiket Diterbitkan', credential.issuedAtWib],
  ];

  const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8" />
<title>E-Tiket ${escapeHtml(credential.ticketCode)}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 32px; color: #0f172a; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { color: #64748b; font-size: 12px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { width: 38%; color: #475569; font-weight: 600; }
  .code { font-family: ui-monospace, Menlo, monospace; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
  .note { margin-top: 18px; font-size: 11px; color: #64748b; }
</style></head>
<body>
  <h1>E-Tiket Kegiatan Rete Mali</h1>
  <div class="sub">Bukti pembayaran &amp; kredensial masuk kegiatan</div>
  <table>
    ${rows
      .map(
        ([label, value]) =>
          `<tr><th>${escapeHtml(label)}</th><td${
            label === 'Kode E-Tiket' ? ' class="code"' : ''
          }>${escapeHtml(value)}</td></tr>`
      )
      .join('')}
  </table>
  <p class="note">Tunjukkan E-Tiket ini (cetak atau layar ponsel) kepada petugas untuk check-in. Kode bersifat unik dan hanya berlaku untuk satu peserta.</p>
</body></html>`;

  const win = window.open('', '_blank', 'width=720,height=900');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function TicketCredentialModal({
  open,
  credential,
  onClose,
  onCopyCode,
}: TicketCredentialModalProps) {
  if (!open || !credential) return null;

  const tone = STATUS_TONE[credential.credentialStatus] ?? STATUS_TONE.ACTIVE_VALID;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(credential.ticketCode);
      onCopyCode?.(credential.ticketCode);
    } catch {
      onCopyCode?.(credential.ticketCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="max-h-[92vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="flex items-center gap-1.5 text-base font-extrabold text-slate-900">
              <Ticket size={17} className="text-blue-600" aria-hidden />
              Bukti Pembayaran &amp; E-Tiket
            </h3>
            <p className="text-[11px] text-slate-500">
              Simpan atau cetak bukti ini sebelum hari pelaksanaan.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup bukti pembayaran"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className={`rounded-xl border p-3 text-xs ${tone.box}`}>
          <p className={`flex items-center gap-1.5 font-bold ${tone.text}`}>
            <CheckCircle2 size={14} aria-hidden />
            {credential.paymentStatusLabel}
          </p>
          <p className={`mt-1 text-[11px] ${tone.text}`}>{tone.label}</p>
        </div>

        <dl className="space-y-1.5 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Nama Peserta</dt>
            <dd className="text-right font-semibold text-slate-900">
              {credential.participantName ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Nomor Anggota</dt>
            <dd className="text-right font-mono text-slate-700">
              {credential.participantCode ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Kegiatan</dt>
            <dd className="text-right font-semibold text-slate-900">
              {credential.eventTitle ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Jadwal</dt>
            <dd className="text-right text-slate-700">
              {credential.eventScheduleWib ?? credential.eventDateWib ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="text-right text-slate-700">
              {credential.eventLocation ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Harga Tiket Masuk</dt>
            <dd className="text-right text-slate-700">
              {credential.ticketPrice > 0
                ? formatCurrency(credential.ticketPrice)
                : 'Gratis'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Status Pembayaran</dt>
            <dd className="text-right font-semibold text-slate-900">
              {credential.paymentStatusLabel}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Diverifikasi Pada</dt>
            <dd className="text-right text-slate-700">
              {credential.verifiedAtWib ?? '-'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Tiket Diterbitkan</dt>
            <dd className="text-right text-slate-700">{credential.issuedAtWib}</dd>
          </div>
        </dl>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Kode E-Tiket
          </p>
          <p className="mt-1 font-mono text-xl font-extrabold tracking-widest text-slate-900">
            {credential.ticketCode}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Tunjukkan kode ini ke petugas saat check-in.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => printCredential(credential)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            <Printer size={14} aria-hidden />
            Cetak / Simpan PDF
          </button>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <Copy size={14} aria-hidden />
            Salin Kode
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
