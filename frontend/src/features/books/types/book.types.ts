export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE';

export type BookCategory =
  | 'FIKSI_SASTRA'
  | 'SAINS_FAKTA'
  | 'SEJARAH'
  | 'PSIKOLOGI'
  | 'EDUKASI_ANAK'
  | 'ENSIKLOPEDIA'
  | 'KOMIK_EDUKASI';

export interface Book {
  id: string;
  bookCode: string;
  isbn?: string | null;
  title: string;
  slug: string;
  author: string;
  publisher?: string | null;
  publishYear?: number | null;
  category: BookCategory;
  synopsis?: string | null;
  coverImage?: string | null;
  shelfLocation: string;
  totalStock: number;
  availableStock: number;
  rating: string | number;
  borrowCount: number;
  status: BookStatus;
  createdAt?: string;
  updatedAt?: string;
}
