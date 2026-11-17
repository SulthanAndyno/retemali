import { QrCode } from 'lucide-react';
import { getImageUrl } from '@/shared/lib/utils';
import type { PaymentAccount } from '../types/donation.types';

interface QrisCardProps {
  account: PaymentAccount;
}

export function QrisCard({ account }: QrisCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
      <div className="w-56 bg-white border border-slate-300 rounded-2xl mx-auto shadow-sm overflow-hidden text-center">
        <div className="bg-rose-600 px-3 py-1.5 flex items-center justify-between text-white">
          <span className="font-black text-sm tracking-widest">QRIS</span>
          <span className="text-[9px] font-semibold tracking-tight uppercase">
            Pembayaran Digital
          </span>
        </div>

        <div className="p-3 flex flex-col items-center">
          <p className="text-[11px] font-extrabold text-slate-900 leading-tight">
            {account.providerName}
          </p>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            NMID: {account.qrisNmid || '-'}
          </p>

          <div className="w-44 h-44 my-2 bg-white flex items-center justify-center p-1 rounded-xl border border-slate-100">
            {account.qrisImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(account.qrisImageUrl)}
                alt="QRIS Barcode Donasi Rete Mali"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-slate-400 px-2">
                <QrCode size={40} className="mb-1" />
                <p className="text-[10px] leading-snug">
                  Gambar QRIS belum diunggah admin.
                </p>
              </div>
            )}
          </div>

          <span className="text-[9px] text-slate-400 font-medium">
            Dicetak oleh: GPN / ASPI
          </span>
        </div>
      </div>

      <p className="text-[11px] font-bold text-slate-800">
        {account.accountName || account.providerName}
      </p>
      <p className="text-[10px] text-slate-500">
        Pindai menggunakan GoPay, OVO, Dana, ShopeePay, BCA Mobile, atau Livin Mandiri.
      </p>
    </div>
  );
}
