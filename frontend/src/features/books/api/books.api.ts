import { del, get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type { Book, BookAgeGroup } from '../types/book.types';
import type {
  BookFormValues,
  BookmarkEntry,
  BorrowedLoan,
  CatalogBook,
  CatalogSort,
  CatalogTab,
} from '../types/catalog.types';

const PAGE_SIZE = 10;
const PUBLIC_PAGE_SIZE = 12;

export type PublicBookSort =
  | CatalogSort
  | 'title-asc'
  | 'title-desc';

export interface PublicBookListParams {
  page: number;
  search?: string;
  category?: string;
  ageGroup?: BookAgeGroup | 'ALL';
  availableOnly?: boolean;
  sortBy?: PublicBookSort;
}

export function getPublicBooks({
  page,
  search,
  category,
  ageGroup,
  availableOnly,
  sortBy = 'newest',
}: PublicBookListParams) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PUBLIC_PAGE_SIZE),
    sortBy: sortBy === 'title-asc' || sortBy === 'title-desc' ? 'newest' : sortBy,
  });

  if (search?.trim()) query.set('search', search.trim());
  if (category && category !== 'ALL') query.set('category', category);
  if (ageGroup && ageGroup !== 'ALL') query.set('ageGroup', ageGroup);
  if (availableOnly) query.set('status', 'AVAILABLE');

  return get<ApiEnvelope<CatalogBook[]> & { meta?: PaginatedMeta }>(
    `/books?${query.toString()}`
  );
}

export function getBookById(identifier: string) {
  return get<ApiEnvelope<Book>>(`/books/${encodeURIComponent(identifier)}`);
}

export interface BookListParams {
  page: number;
  search: string;
  tab: CatalogTab;
  ageGroup?: BookAgeGroup | 'ALL';
  sortBy: CatalogSort;
}

export function getBooks({ page, search, tab, ageGroup, sortBy }: BookListParams) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sortBy,
  });

  if (search.trim()) query.set('search', search.trim());
  if (tab === 'AVAILABLE' || tab === 'BORROWED') {
    query.set('status', tab);
  } else if (tab !== 'ALL') {
    query.set('category', tab);
  }

  if (ageGroup && ageGroup !== 'ALL') query.set('ageGroup', ageGroup);

  return get<ApiEnvelope<CatalogBook[]> & { meta?: PaginatedMeta }>(
    `/books?${query.toString()}`
  );
}

export function getMyBorrowedBooks() {
  return get<ApiEnvelope<BorrowedLoan[]>>('/circulation/loans/me?status=BORROWED');
}

export function getMyBookmarks() {
  return get<ApiEnvelope<BookmarkEntry[]> & { meta?: PaginatedMeta }>(
    '/books/bookmarks/me?limit=100'
  );
}

export function toggleBookmark(id: string) {
  return post<ApiEnvelope<{ bookmarked: boolean }>>(`/books/${id}/bookmark`);
}

export function reserveBook(id: string) {
  return post<ApiEnvelope<unknown>>('/circulation/reservations', { bookId: id });
}

function buildBookFormData(values: BookFormValues, coverFile: File | null) {
  const body = new FormData();
  body.append('title', values.title.trim());
  body.append('author', values.author.trim());
  body.append('category', values.category);
  body.append('shelfLocation', values.shelfLocation.trim());
  body.append('totalStock', String(values.totalStock));
  body.append('ageGroup', values.ageGroup);
  if (values.publisher.trim()) body.append('publisher', values.publisher.trim());
  if (values.isbn.trim()) body.append('isbn', values.isbn.trim());
  if (values.synopsis.trim()) body.append('synopsis', values.synopsis.trim());
  if (coverFile) body.append('coverImage', coverFile);
  return body;
}

export function createBook(values: BookFormValues, coverFile: File | null) {
  return post<ApiEnvelope<Book>>('/books', buildBookFormData(values, coverFile));
}

export function updateBook(id: string, values: BookFormValues, coverFile: File | null) {
  return patch<ApiEnvelope<Book>>(
    `/books/${id}`,
    buildBookFormData(values, coverFile)
  );
}

export function deleteBook(id: string) {
  return del<ApiEnvelope<unknown>>(`/books/${id}`);
}
