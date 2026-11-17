import { formatRupiah } from '@/shared/lib/format';

/** Label denda ringkas untuk chip: "Rp 15.000" → "15.000". */
export function formatFineCompact(amount: number): string {
  return formatRupiah(amount).replace('Rp', '').trim();
}
