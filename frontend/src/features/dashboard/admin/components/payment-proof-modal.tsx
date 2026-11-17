import { X } from 'lucide-react';

interface PaymentProofModalProps {
  url: string | null;
  onClose: () => void;
}

export function PaymentProofModal({ url, onClose }: PaymentProofModalProps) {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-3 max-w-md w-full max-h-[85vh] overflow-auto space-y-2"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900">Bukti Pembayaran Peserta</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>
        {/\.pdf($|\?)/i.test(url) ? (
          <iframe
            src={url}
            title="Bukti pembayaran"
            className="w-full h-[60vh] rounded-lg border"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Bukti pembayaran peserta"
            className="w-full rounded-lg border object-contain"
          />
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[11px] font-bold text-blue-700 hover:underline"
        >
          Buka di tab baru
        </a>
      </div>
    </div>
  );
}
