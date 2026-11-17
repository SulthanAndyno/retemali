import { ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react';
import { CATALOG_SORT_LABELS } from '../lib/catalog-query';
import type { CatalogSort } from '../types/catalog.types';

interface CatalogToolbarProps {
  searchQuery: string;
  sortBy: CatalogSort;
  onSearchChange: (value: string) => void;
  onCycleSort: () => void;
  onReset: () => void;
}

export function CatalogToolbar({
  searchQuery,
  sortBy,
  onSearchChange,
  onCycleSort,
  onReset,
}: CatalogToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari judul, penulis, rak..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <button
        onClick={onReset}
        className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"
        title="Filter opsi"
      >
        <SlidersHorizontal size={17} />
      </button>

      <button
        onClick={onCycleSort}
        className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
      >
        <ArrowUpDown size={15} className="text-blue-600" />
        <span>{CATALOG_SORT_LABELS[sortBy]}</span>
      </button>
    </div>
  );
}
