import { Banknote, Heart, Ticket, Wallet } from 'lucide-react';
import type { CashCategory } from '../types/report.types';

interface CashCategoryIconProps {
  category: CashCategory | string;
}

export function CashCategoryIcon({ category }: CashCategoryIconProps) {
  if (category === 'DONASI_FINANSIAL') {
    return <Heart size={14} className="text-blue-600" />;
  }
  if (category === 'INFAQ_KEGIATAN') {
    return <Ticket size={14} className="text-emerald-600" />;
  }
  if (category === 'DENDA_SIRKULASI') {
    return <Banknote size={14} className="text-amber-600" />;
  }
  return <Wallet size={14} className="text-slate-500" />;
}
