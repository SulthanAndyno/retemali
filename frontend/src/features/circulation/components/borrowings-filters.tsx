import { Search } from 'lucide-react';
import { STATUS_TABS } from '../lib/borrowing-status';
import type { BorrowingStatusFilter } from '../types/circulation.types';

interface BorrowingsFiltersProps {
  searchInput: string;
  status: BorrowingStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: BorrowingStatusFilter) => void;
}

export function BorrowingsFilters({
  searchInput,
  status,
  onSearchChange,
  onStatusChange,
}: BorrowingsFiltersProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100/70 p-3 space-y-2.5">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama anggota, kode buku, atau no. pinjam..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
              status === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}
