import { BOOK_CATEGORY_OPTIONS } from './book-category';
import type { CatalogSort, CatalogTab } from '../types/catalog.types';

export const CATALOG_PAGE_SIZE = 10;

export const CATALOG_TABS: readonly { value: CatalogTab; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'AVAILABLE', label: 'Tersedia' },
  { value: 'BORROWED', label: 'Sedang Dipinjam' },
  ...BOOK_CATEGORY_OPTIONS,
];

export const CATALOG_SORT_LABELS: Record<CatalogSort, string> = {
  newest: 'Terbaru',
  popular: 'Terpopuler',
  rating: 'Rating',
};

const CATEGORY_VALUES = new Set(CATALOG_TABS.map((tab) => tab.value));

export function resolveCatalogTab(value: string | undefined): CatalogTab {
  return value && CATEGORY_VALUES.has(value as CatalogTab)
    ? (value as CatalogTab)
    : 'ALL';
}

export function nextCatalogSort(current: CatalogSort): CatalogSort {
  if (current === 'newest') return 'popular';
  if (current === 'popular') return 'rating';
  return 'newest';
}

export function formatBookRating(rating: string | number | null | undefined): string {
  const value = Number(rating ?? 0);
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
}
