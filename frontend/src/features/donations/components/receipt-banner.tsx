import { CheckCircle2 } from 'lucide-react';

interface ReceiptBannerProps {
  code: string;
}

export function ReceiptBanner({ code }: ReceiptBannerProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5 text-center">
      <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
      <h4 className="text-xs font-bold text-emerald-900">Kuitansi Digital Terbit</h4>
      <p className="font-mono text-sm font-extrabold text-emerald-700">{code}</p>
      <p className="text-[10px] text-emerald-600">
        Simpan kode ini sebagai bukti pencatatan audit donasi literasi warga.
      </p>
    </div>
  );
}
