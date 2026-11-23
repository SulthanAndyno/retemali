import type { GalleryCategory } from '../types/gallery.types';

export const GALLERY_CATEGORY_OPTIONS: {
  value: GalleryCategory;
  label: string;
}[] = [
  { value: 'SUASANA', label: 'Suasana' },
  { value: 'KEGIATAN', label: 'Kegiatan' },
  { value: 'FASILITAS', label: 'Fasilitas' },
  { value: 'KOLEKSI', label: 'Koleksi' },
];

export function galleryCategoryLabel(category: string): string {
  return (
    GALLERY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
    category
  );
}
