import { EVENT_CATEGORIES } from '../lib/event-options';
import type { EventCategory } from '../types/event.types';

interface EventCategoryPillsProps {
  activeCategory: 'ALL' | EventCategory;
  onSelect: (category: 'ALL' | EventCategory) => void;
}

export function EventCategoryPills({
  activeCategory,
  onSelect,
}: EventCategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {EVENT_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === category.value
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
