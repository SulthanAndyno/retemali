import { HOME_CATEGORIES } from '../lib/book-category';
import type { HomeCategoryValue } from '../types/home.types';

interface HomeCategoryPillsProps {
  activeCategory: HomeCategoryValue;
  onSelect: (category: HomeCategoryValue) => void;
}

export function HomeCategoryPills({
  activeCategory,
  onSelect,
}: HomeCategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {HOME_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.value;

        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
