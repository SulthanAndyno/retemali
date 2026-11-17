import type { FormEvent } from 'react';
import { Heart } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import type { PaymentAccount } from '../types/donation.types';
import { AmountInput } from './amount-input';
import { AmountPresets } from './amount-presets';
import { BankTransferCard } from './bank-transfer-card';
import { DonorIdentityFields } from './donor-identity-fields';
import { PaymentMethodPicker } from './payment-method-picker';
import { PurposeSelect } from './purpose-select';
import { QrisCard } from './qris-card';

interface FinancialDonationFormProps {
  amount: number;
  donorName: string;
  donorEmail: string;
  purposeLabel: string;
  isAnonymous: boolean;
  loading: boolean;
  accounts: PaymentAccount[];
  selectedAccount: PaymentAccount | null;
  selectedAccountId: string | null;
  copiedField: string | null;
  channelsLoading: boolean;
  channelsError: string | null;
  onAmountChange: (value: number) => void;
  onPurposeChange: (value: string) => void;
  onAnonymousChange: (value: boolean) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSelectAccount: (id: string) => void;
  onCopy: (account: PaymentAccount) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function FinancialDonationForm({
  amount,
  donorName,
  donorEmail,
  purposeLabel,
  isAnonymous,
  loading,
  accounts,
  selectedAccount,
  selectedAccountId,
  copiedField,
  channelsLoading,
  channelsError,
  onAmountChange,
  onPurposeChange,
  onAnonymousChange,
  onNameChange,
  onEmailChange,
  onSelectAccount,
  onCopy,
  onSubmit,
}: FinancialDonationFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/70 space-y-3.5 text-xs"
    >
      <AmountPresets amount={amount} onSelect={onAmountChange} />
      <AmountInput amount={amount} onChange={onAmountChange} />
      <PurposeSelect value={purposeLabel} onChange={onPurposeChange} />
      <DonorIdentityFields
        isAnonymous={isAnonymous}
        donorName={donorName}
        donorEmail={donorEmail}
        onAnonymousChange={onAnonymousChange}
        onNameChange={onNameChange}
        onEmailChange={onEmailChange}
      />
      <PaymentMethodPicker
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        loading={channelsLoading}
        error={channelsError}
        onSelect={onSelectAccount}
      />

      {selectedAccount?.type === 'QRIS' && <QrisCard account={selectedAccount} />}

      {selectedAccount?.type === 'BANK_TRANSFER' && (
        <BankTransferCard
          account={selectedAccount}
          copied={copiedField === selectedAccount.id}
          onCopy={() => onCopy(selectedAccount)}
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
      >
        <Heart size={16} className="fill-white" />
        <span>{loading ? 'Memproses...' : `Kirim Donasi ${formatCurrency(amount)}`}</span>
      </button>
    </form>
  );
}
