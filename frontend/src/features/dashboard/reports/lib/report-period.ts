export type CashPreset = 'THIS_MONTH' | 'LAST_3_MONTHS' | 'THIS_YEAR' | 'CUSTOM';

export const CASH_PRESET_LABELS: Record<CashPreset, string> = {
  THIS_MONTH: 'Bulan ini',
  LAST_3_MONTHS: '3 bulan',
  THIS_YEAR: 'Tahun ini',
  CUSTOM: 'Kustom',
};

export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolvePreset(preset: CashPreset): { from: string; to: string } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (preset === 'THIS_MONTH') {
    return {
      from: toInputDate(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: toInputDate(end),
    };
  }
  if (preset === 'LAST_3_MONTHS') {
    return {
      from: toInputDate(new Date(now.getFullYear(), now.getMonth() - 2, 1)),
      to: toInputDate(end),
    };
  }
  if (preset === 'THIS_YEAR') {
    return { from: toInputDate(new Date(now.getFullYear(), 0, 1)), to: toInputDate(end) };
  }
  return { from: '', to: '' };
}
