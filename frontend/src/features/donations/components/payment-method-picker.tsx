import type { PaymentAccount } from '../types/donation.types';

interface PaymentMethodPickerProps {
  accounts: PaymentAccount[];
  selectedAccountId: string | null;
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
}

export function PaymentMethodPicker({
  accounts,
  selectedAccountId,
  loading,
  error,
  onSelect,
}: PaymentMethodPickerProps) {
  return (
    <div className="space-y-2 pt-1 border-t border-slate-100">
      <label className="font-semibold text-slate-700 block">Metode Pembayaran</label>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
          {error ?? 'Belum ada metode pembayaran aktif. Silakan hubungi admin Rete Mali.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {accounts.map((account) => {
            const isSelected = selectedAccountId === account.id;

            return (
              <button
                key={account.id}
                type="button"
                onClick={() => onSelect(account.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <p className="font-bold text-xs truncate">{account.providerName}</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {account.type === 'QRIS' ? 'Semua E-Wallet' : 'Transfer Bank'}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
