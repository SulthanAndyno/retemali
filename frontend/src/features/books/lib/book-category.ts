import type { BookAgeGroup, BookCategory } from '../types/book.types';
import type { HomeCategoryOption } from '../types/home.types';

export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
  FIKSI_SASTRA: 'Fiksi & Sastra',
  SAINS_FAKTA: 'Sains & Fakta',
  SEJARAH: 'Sejarah',
  PSIKOLOGI: 'Psikologi',
  EDUKASI_ANAK: 'Edukasi Anak',
  ENSIKLOPEDIA: 'Ensiklopedia',
  KOMIK_EDUKASI: 'Komik Edukasi',
};

export const BOOK_CATEGORY_OPTIONS: readonly {
  value: BookCategory;
  label: string;
}[] = (
  Object.entries(BOOK_CATEGORY_LABELS) as [BookCategory, string][]
).map(([value, label]) => ({ value, label }));

export type AgeGroupTone = 'success' | 'warning' | 'info' | 'danger';

export const BOOK_AGE_GROUP_OPTIONS: readonly {
  value: BookAgeGroup;
  label: string;
  tone: AgeGroupTone;
  chipActiveClass: string;
}[] = [
  {
    value: '0 - 6 Tahun',
    label: '0 - 6 Tahun',
    tone: 'success',
    chipActiveClass: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  },
  {
    value: '7 - 12 Tahun',
    label: '7 - 12 Tahun',
    tone: 'warning',
    chipActiveClass: 'border-amber-300 bg-amber-50 text-[#8a5807]',
  },
  {
    value: '13 - 16 Tahun',
    label: '13 - 16 Tahun',
    tone: 'info',
    chipActiveClass: 'border-blue-300 bg-surface-blue text-primary-deep',
  },
  {
    value: '> 16 Tahun',
    label: '> 16 Tahun',
    tone: 'danger',
    chipActiveClass: 'border-red-300 bg-red-50 text-danger',
  },
];

export function getBookAgeGroupTone(
  value?: string | null
): AgeGroupTone | 'neutral' {
  return (
    BOOK_AGE_GROUP_OPTIONS.find((option) => option.value === value)?.tone ??
    'neutral'
  );
}

export function resolveBookAgeGroup(value?: string): BookAgeGroup | 'ALL' {
  return BOOK_AGE_GROUP_OPTIONS.some((option) => option.value === value)
    ? (value as BookAgeGroup)
    : 'ALL';
}

export const HOME_CATEGORIES: readonly HomeCategoryOption[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'FIKSI_SASTRA', label: 'Fiksi & Sastra' },
  { value: 'SAINS_FAKTA', label: 'Sains & Fakta' },
  { value: 'SEJARAH', label: 'Sejarah' },
];

export function getBookCategoryLabel(category: string): string {
  return BOOK_CATEGORY_LABELS[category as BookCategory] ?? category;
}
