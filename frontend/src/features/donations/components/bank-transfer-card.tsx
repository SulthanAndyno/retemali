import { CheckCircle2, Copy } from 'lucide-react';
import type { PaymentAccount } from '../types/donation.types';

interface BankTransferCardProps {
  account: PaymentAccount;
  copied: boolean;
  onCopy: () => void;
}

export function BankTransferCard({ account, copied, onCopy }: BankTransferCardProps) {
  return (
    <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
            {(account.providerName || 'BK').slice(0, 3).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-xs text-blue-950">{account.providerName}</p>
            <p className="text-[10px] text-slate-500">Transfer Antar Bank / VA</p>
          </div>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
          Online 24 Jam
        </span>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">
            Nomor Rekening {account.providerName}:
          </span>
          <span className="font-mono font-extrabold text-sm text-slate-900 tracking-wider">
            {account.accountNumber || '-'}
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5">
            a.n. {account.accountName || '-'}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span className="text-emerald-700">Tersalin</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <p className="text-[10px] text-slate-500 text-center">
        Sertakan berita transfer:{' '}
        <span className="font-semibold text-slate-700">Donasi Rete Mali</span>
      </p>
    </div>
  );
}
