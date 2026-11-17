import { QrCode } from 'lucide-react';

interface QuickScanBarProps {
  onScan: () => void;
}

export function QuickScanBar({ onScan }: QuickScanBarProps) {
  return (
    <section className="bg-white border border-blue-100 rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <QrCode size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 leading-tight">Sedang di Taman Baca?</p>
          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
            Pindai barcode buku untuk meminjam cepat.
          </p>
        </div>
      </div>
      <button
        onClick={onScan}
        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-colors"
      >
        Pindai
      </button>
    </section>
  );
}
