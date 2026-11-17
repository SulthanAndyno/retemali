import type { BookCategory } from '../types/book.types';
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

export const HOME_CATEGORIES: readonly HomeCategoryOption[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'FIKSI_SASTRA', label: 'Fiksi & Sastra' },
  { value: 'SAINS_FAKTA', label: 'Sains & Fakta' },
  { value: 'SEJARAH', label: 'Sejarah' },
];

export function getBookCategoryLabel(category: string): string {
  return BOOK_CATEGORY_LABELS[category as BookCategory] ?? category;
}
