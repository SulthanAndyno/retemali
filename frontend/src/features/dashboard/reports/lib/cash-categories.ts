import type { CashCategory } from '../types/report.types';

export const CASH_CATEGORY_LABELS: Record<CashCategory, string> = {
  DONASI_FINANSIAL: 'Donasi Finansial',
  INFAQ_KEGIATAN: 'Infaq Kegiatan',
  DENDA_SIRKULASI: 'Denda Sirkulasi',
};

export const CASH_CATEGORY_BAR_CLASSES: Record<CashCategory, string> = {
  DONASI_FINANSIAL: 'bg-blue-600',
  INFAQ_KEGIATAN: 'bg-emerald-500',
  DENDA_SIRKULASI: 'bg-amber-500',
};

export const CASH_CATEGORY_ORDER: readonly CashCategory[] = [
  'DONASI_FINANSIAL',
  'INFAQ_KEGIATAN',
  'DENDA_SIRKULASI',
];
