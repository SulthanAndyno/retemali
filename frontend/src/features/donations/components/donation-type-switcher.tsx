import { BookOpen, QrCode } from 'lucide-react';
import type { DonationType } from '../types/donation.types';

interface DonationTypeSwitcherProps {
  value: DonationType;
  onChange: (value: DonationType) => void;
}

export function DonationTypeSwitcher({ value, onChange }: DonationTypeSwitcherProps) {
  return (
    <div className="grid grid-cols-2 bg-slate-200/80 p-1 rounded-2xl gap-1">
      <button
        onClick={() => onChange('financial')}
        className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
          value === 'financial'
            ? 'bg-white text-blue-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <QrCode size={15} />
        <span>Donasi Finansial</span>
      </button>
      <button
        onClick={() => onChange('book')}
        className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
          value === 'book'
            ? 'bg-white text-blue-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <BookOpen size={15} />
        <span>Donasi Buku Fisik</span>
      </button>
    </div>
  );
}
