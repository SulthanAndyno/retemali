import type {
  DeliveryMethod,
  PaymentAccount,
  PaymentMethod,
} from '../types/donation.types';

export const MIN_DONATION = 10_000;

export const DONATION_PRESETS: readonly number[] = [
  10000, 25000, 50000, 100000, 250000,
];

export const DONATION_PURPOSES: readonly string[] = [
  'Peralatan & Rak Ensiklopedia',
  'Operasional Kelas Anak & Dongeng',
  'Pengadaan Buku Bacaan Baru',
  'Infaq Kas Umum Saung Baca',
];

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  DROP_OFF: 'Drop-off di Saung',
  COURIER: 'Kirim via Ekspedisi',
};

export const DEFAULT_ACCOUNT_NAME = 'Yayasan Taman Baca Rete Mali Jatirangga';
export const DEFAULT_PROVIDER_NAME = 'TAMAN BACA RETE MALI';

const PROVIDER_PAYMENT_METHODS: { keyword: string; method: PaymentMethod }[] = [
  { keyword: 'mandiri', method: 'BANK_MANDIRI' },
  { keyword: 'bca', method: 'BANK_BCA' },
  { keyword: 'gopay', method: 'GOPAY' },
  { keyword: 'ovo', method: 'OVO' },
  { keyword: 'dana', method: 'DANA' },
  { keyword: 'shopeepay', method: 'SHOPEEPAY' },
];

export function resolvePaymentMethod(account: PaymentAccount | null): PaymentMethod {
  if (!account || account.type === 'QRIS') return 'QRIS';

  const name = account.providerName.toLowerCase();
  const match = PROVIDER_PAYMENT_METHODS.find((item) => name.includes(item.keyword));
  // Backend only accepts the documented enum; unknown banks fall back to Mandiri.
  return match?.method ?? 'BANK_MANDIRI';
}

export function getCampaignPercentage(collected: number, target: number): number {
  if (!Number.isFinite(collected) || !Number.isFinite(target) || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((collected / target) * 100)));
}
