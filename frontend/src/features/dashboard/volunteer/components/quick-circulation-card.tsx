'use client';

import { Camera, Check, Scan } from 'lucide-react';
import type { FormEvent } from 'react';
import type { CirculationTab } from '../hooks/use-quick-circulation';

interface QuickCirculationCardProps {
  tab: CirculationTab;
  memberCode: string;
  bookCode: string;
  pending: boolean;
  onTabChange: (tab: CirculationTab) => void;
  onMemberCodeChange: (value: string) => void;
  onBookCodeChange: (value: string) => void;
  onSubmit: () => void;
}

export function QuickCirculationCard({
  tab,
  memberCode,
  bookCode,
  pending,
  onTabChange,
  onMemberCodeChange,
  onBookCodeChange,
  onSubmit,
}: QuickCirculationCardProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Scan size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Sirkulasi Cepat</h3>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
          Katalog Aktif
        </span>
      </div>

      <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl gap-1">
        <button
          onClick={() => onTabChange('checkout')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'checkout'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Peminjaman Baru
        </button>
        <button
          onClick={() => onTabChange('return')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'return'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pengembalian
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {tab === 'checkout' && (
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <label className="font-semibold text-slate-700">ID / Barcode Anggota</label>
              <button
                type="button"
                onClick={() => onMemberCodeChange('RM-2024-0188')}
                className="text-blue-600 hover:underline font-medium"
              >
                ✧ Auto-Fill Demo
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: RM-2024-0188"
                value={memberCode}
                onChange={(e) => onMemberCodeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16 font-mono"
              />
              <button
                type="button"
                onClick={() => onMemberCodeChange('RM-2024-0188')}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                <Scan size={12} /> Scan
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <label className="font-semibold text-slate-700">Kode Barcode / ISBN Buku</label>
            <button
              type="button"
              onClick={() => onBookCodeChange('BK-FA-0042')}
              className="text-blue-600 hover:underline font-medium"
            >
              Koleksi Rete Mali
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Contoh: BK-FA-0042 atau 978602..."
              value={bookCode}
              onChange={(e) => onBookCodeChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16 font-mono"
            />
            <button
              type="button"
              onClick={() => onBookCodeChange('BK-FA-0042')}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
            >
              <Camera size={12} /> Scan
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 mt-1"
        >
          <Check size={16} />
          <span>{pending ? 'Memproses...' : 'Proses Sirkulasi Instan'}</span>
        </button>
      </form>
    </section>
  );
}
