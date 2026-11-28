'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  BOOK_AGE_GROUP_OPTIONS,
  type AgeGroupTone,
} from '../lib/book-category';
import type { BookAgeGroup } from '../types/book.types';
import { BookFilterSheet } from './book-filter-sheet';
import {
  ActiveFilterChip,
  FilterButton,
  FilterOptionGrid,
  FilterSelect,
  type FilterOptionGroup,
} from './filter-controls';

interface SortOption {
  value: string;
  label: string;
}

interface BookFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterTitle?: string;
  category: string;
  categoryGroups: readonly FilterOptionGroup[];
  categoryLabel?: string;
  onCategoryChange: (value: string) => void;
  ageGroup: BookAgeGroup | 'ALL';
  onAgeGroupChange: (value: BookAgeGroup | 'ALL') => void;
  availableOnly?: boolean;
  onAvailableOnlyChange?: (value: boolean) => void;
  sortBy: string;
  sortOptions: readonly SortOption[];
  onSortChange: (value: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  statusText?: string;
}

const AGE_DOT_CLASSES: Record<AgeGroupTone, string> = {
  success: 'bg-success',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  danger: 'bg-danger',
};

const AGE_FILTER_GROUPS: readonly FilterOptionGroup[] = [
  {
    options: [
      { value: 'ALL', label: 'Semua Usia' },
      ...BOOK_AGE_GROUP_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        dotClassName: AGE_DOT_CLASSES[option.tone],
        activeClassName: option.chipActiveClass,
      })),
    ],
  },
];

const DESKTOP_GRID_WITH_AVAILABILITY =
  'hidden gap-2 md:grid md:grid-cols-2 md:items-end xl:grid-cols-[minmax(220px,1fr)_150px_150px_auto_150px_auto]';
const DESKTOP_GRID_WITHOUT_AVAILABILITY =
  'hidden gap-2 md:grid md:grid-cols-2 md:items-end xl:grid-cols-[minmax(220px,1fr)_160px_150px_150px_auto]';

function optionLabel(
  groups: readonly FilterOptionGroup[],
  value: string
): string {
  for (const group of groups) {
    const match = group.options.find((option) => option.value === value);
    if (match) return match.label;
  }
  return value;
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        aria-hidden
      />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-field border border-surface-soft bg-white pl-9 pr-9 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:h-10 md:text-xs"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-blue hover:text-primary-deep"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export function BookFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari judul, penulis, ISBN, atau rak…',
  filterTitle = 'Filter Buku',
  category,
  categoryGroups,
  categoryLabel = 'Kategori',
  onCategoryChange,
  ageGroup,
  onAgeGroupChange,
  availableOnly,
  onAvailableOnlyChange,
  sortBy,
  sortOptions,
  onSortChange,
  onReset,
  activeFilterCount,
  statusText,
}: BookFilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(category);
  const [draftAgeGroup, setDraftAgeGroup] =
    useState<BookAgeGroup | 'ALL'>(ageGroup);
  const [draftAvailableOnly, setDraftAvailableOnly] =
    useState<boolean>(!!availableOnly);

  const hasAvailability =
    availableOnly !== undefined && onAvailableOnlyChange !== undefined;

  const openSheet = () => {
    setDraftCategory(category);
    setDraftAgeGroup(ageGroup);
    setDraftAvailableOnly(!!availableOnly);
    setSheetOpen(true);
  };

  const applyDraft = () => {
    if (draftCategory !== category) onCategoryChange(draftCategory);
    if (draftAgeGroup !== ageGroup) onAgeGroupChange(draftAgeGroup);
    if (
      hasAvailability &&
      draftAvailableOnly !== Boolean(availableOnly)
    ) {
      onAvailableOnlyChange(draftAvailableOnly);
    }
    setSheetOpen(false);
  };

  const resetDraft = () => {
    setDraftCategory('ALL');
    setDraftAgeGroup('ALL');
    setDraftAvailableOnly(false);
  };

  const activeChips: {
    label: string;
    onRemove: () => void;
    toneClassName?: string;
  }[] = [];
  if (category !== 'ALL') {
    activeChips.push({
      label: optionLabel(categoryGroups, category),
      onRemove: () => onCategoryChange('ALL'),
    });
  }
  if (ageGroup !== 'ALL') {
    activeChips.push({
      label: `Usia: ${optionLabel(AGE_FILTER_GROUPS, ageGroup)}`,
      onRemove: () => onAgeGroupChange('ALL'),
      toneClassName: BOOK_AGE_GROUP_OPTIONS.find(
        (option) => option.value === ageGroup
      )?.chipActiveClass,
    });
  }
  if (availableOnly) {
    activeChips.push({
      label: 'Tersedia',
      onRemove: () => onAvailableOnlyChange?.(false),
    });
  }

  const sortGroups: FilterOptionGroup[] = [{ options: sortOptions }];

  return (
    <>
      <section
        aria-label="Pencarian dan filter"
        className="space-y-3 rounded-card border border-surface-soft bg-white p-3 shadow-card md:p-4"
      >
        <div className="space-y-2 md:hidden">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_9.5rem] gap-2">
            <FilterButton
              count={activeFilterCount}
              onClick={openSheet}
              expanded={sheetOpen}
            />
            <FilterSelect
              id="book-sort-mobile"
              label="Urutkan"
              hideLabel
              value={sortBy}
              groups={sortGroups}
              onChange={onSortChange}
            />
          </div>
        </div>

        <div
          className={
            hasAvailability
              ? DESKTOP_GRID_WITH_AVAILABILITY
              : DESKTOP_GRID_WITHOUT_AVAILABILITY
          }
        >
          <div className="md:col-span-2 xl:col-span-1">
            <SearchField
              value={search}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
          <FilterSelect
            id="book-category"
            label={categoryLabel}
            value={category}
            groups={categoryGroups}
            onChange={onCategoryChange}
          />
          <FilterSelect
            id="book-age"
            label="Usia"
            value={ageGroup}
            groups={AGE_FILTER_GROUPS}
            onChange={(value) => onAgeGroupChange(value as BookAgeGroup | 'ALL')}
          />
          {hasAvailability ? (
            <div>
              <span className="mb-1 block text-[11px] font-semibold text-ink-soft">
                Ketersediaan
              </span>
              <button
                type="button"
                aria-pressed={availableOnly}
                onClick={() => onAvailableOnlyChange?.(!availableOnly)}
                className={`h-11 w-full rounded-field border px-3 text-xs font-semibold transition-colors md:h-10 ${
                  availableOnly
                    ? 'border-success bg-green-50 text-success'
                    : 'border-surface-soft bg-white text-ink hover:border-primary/40'
                }`}
              >
                Tersedia saja
              </button>
            </div>
          ) : null}
          <FilterSelect
            id="book-sort"
            label="Urutkan"
            value={sortBy}
            groups={sortGroups}
            onChange={onSortChange}
          />
          <div>
            <span
              className="mb-1 block text-[11px] font-semibold text-ink-soft"
              aria-hidden
            >
              &nbsp;
            </span>
            <button
              type="button"
              onClick={onReset}
              className="h-11 w-full rounded-field border border-surface-soft bg-white px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-primary/40 hover:text-primary-deep md:h-10"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-surface-soft pt-3">
          {activeChips.map((chip) => (
            <ActiveFilterChip
              key={chip.label}
              label={chip.label}
              onRemove={chip.onRemove}
              toneClassName={chip.toneClassName}
            />
          ))}
          {activeChips.length > 0 ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-semibold text-primary-deep underline-offset-2 hover:underline"
            >
              Hapus semua
            </button>
          ) : null}
          {statusText ? (
            <p
              role="status"
              aria-live="polite"
              className="ml-auto text-xs text-ink-soft"
            >
              {statusText}
            </p>
          ) : null}
        </div>
      </section>

      <BookFilterSheet
        open={sheetOpen}
        title={filterTitle}
        description="Pilih filter yang ingin diterapkan."
        onClose={() => setSheetOpen(false)}
        onResetDraft={resetDraft}
        onApply={applyDraft}
      >
        <section>
          <h3 className="mb-2 text-xs font-bold text-primary-deep">
            {categoryLabel}
          </h3>
          <FilterOptionGrid
            groups={categoryGroups}
            value={draftCategory}
            onChange={setDraftCategory}
          />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-bold text-primary-deep">Usia</h3>
          <FilterOptionGrid
            groups={AGE_FILTER_GROUPS}
            value={draftAgeGroup}
            onChange={(value) =>
              setDraftAgeGroup(value as BookAgeGroup | 'ALL')
            }
          />
        </section>

        {hasAvailability ? (
          <section>
            <h3 className="mb-2 text-xs font-bold text-primary-deep">
              Ketersediaan
            </h3>
            <button
              type="button"
              aria-pressed={draftAvailableOnly}
              onClick={() => setDraftAvailableOnly((current) => !current)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-field border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                draftAvailableOnly
                  ? 'border-primary bg-surface-blue text-primary-deep'
                  : 'border-surface-soft bg-white text-ink'
              }`}
            >
              <span>Hanya tampilkan buku tersedia</span>
              <span
                aria-hidden
                className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  draftAvailableOnly ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    draftAvailableOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </section>
        ) : null}
      </BookFilterSheet>
    </>
  );
}
