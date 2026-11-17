import type { Book, BookCategory } from './book.types';

export type CatalogTab = 'ALL' | 'AVAILABLE' | 'BORROWED' | BookCategory;
export type CatalogSort = 'newest' | 'popular' | 'rating';

export interface BookListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface CatalogBook extends Book {
  isBookmarked?: boolean;
  loanCode?: string;
  dueDate?: string;
}

export interface BookListResponse {
  data: CatalogBook[];
  meta?: BookListMeta;
  pagination?: BookListMeta;
}

export interface BorrowedLoan {
  id: string;
  loanCode: string;
  dueDate: string;
  status: string;
  book: Book;
}

export interface BookmarkEntry {
  id: string;
  bookId: string;
  book: Book;
}

export interface BookFormValues {
  title: string;
  author: string;
  category: BookCategory;
  shelfLocation: string;
  totalStock: number;
  publisher: string;
  isbn: string;
  synopsis: string;
}

export interface BookActionResult {
  ok: boolean;
  message: string;
}
