import { CATALOG_TABS } from '../lib/catalog-query';
import type { CatalogTab } from '../types/catalog.types';

interface CategoryFilterPillsProps {
  activeTab: CatalogTab;
  onSelect: (tab: CatalogTab) => void;
}

export function CategoryFilterPills({ activeTab, onSelect }: CategoryFilterPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {CATALOG_TABS.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onSelect(tab.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
