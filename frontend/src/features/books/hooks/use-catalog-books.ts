'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/features/auth';
import { getBooks, getMyBookmarks, getMyBorrowedBooks } from '../api/books.api';
import { nextCatalogSort } from '../lib/catalog-query';
import type { CatalogBook, CatalogSort, CatalogTab } from '../types/catalog.types';

export interface UseCatalogBooksResult {
  books: CatalogBook[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  activeTab: CatalogTab;
  sortBy: CatalogSort;
  page: number;
  totalBooks: number;
  totalPages: number;
  setSearchQuery: (value: string) => void;
  setActiveTab: (tab: CatalogTab) => void;
  cycleSort: () => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  updateBookmark: (id: string, bookmarked: boolean) => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal memuat katalog buku.';
}

export function useCatalogBooks(
  initialSearch: string,
  initialTab: CatalogTab,
  initialSort: CatalogSort = 'newest',
  initialPage = 1
): UseCatalogBooksResult {
  const { user } = useAuth();
  const initialPageRef = useRef(initialPage);

  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [activeTab, setActiveTabState] = useState<CatalogTab>(initialTab);
  const [sortBy, setSortBy] = useState<CatalogSort>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBooks = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        if (activeTab === 'BORROWED' && user) {
          const loans = await getMyBorrowedBooks();
          const borrowed = loans.data
            .filter((loan) => loan.book && loan.status === 'BORROWED')
            .map((loan) => ({
              ...loan.book,
              status: 'BORROWED' as const,
              availableStock: 0,
              loanCode: loan.loanCode,
              dueDate: loan.dueDate,
            }));

          setBooks(borrowed);
          setPage(1);
          setTotalBooks(borrowed.length);
          setTotalPages(1);
          return;
        }

        const response = await getBooks({
          page: targetPage,
          search: debouncedSearch,
          tab: activeTab,
          sortBy,
        });

        let items: CatalogBook[] = response.data ?? [];

        if (user) {
          try {
            const bookmarks = await getMyBookmarks();
            const bookmarkedIds = new Set(
              bookmarks.data.map((entry) => entry.bookId)
            );
            items = items.map((book) => ({
              ...book,
              isBookmarked: bookmarkedIds.has(book.id),
            }));
          } catch {
            // Bookmark info is optional; keep the catalog usable.
          }
        }

        setBooks((current) => (append ? [...current, ...items] : items));
        const meta = response.meta;
        setPage(targetPage);
        setTotalBooks(meta?.total ?? items.length);
        setTotalPages(meta?.totalPages ?? 1);
      } catch (loadError) {
        setError(errorMessage(loadError));
        if (!append) setBooks([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeTab, debouncedSearch, sortBy, user]
  );

  useEffect(() => {
    const targetPage = initialPageRef.current;
    initialPageRef.current = 1;
    void fetchBooks(targetPage, false);
  }, [fetchBooks]);

  const setActiveTab = (tab: CatalogTab) => {
    setActiveTabState(tab);
    setPage(1);
  };

  const cycleSort = () => {
    setSortBy((current) => nextCatalogSort(current));
    setPage(1);
  };

  const loadMore = () => {
    if (loading || loadingMore || page >= totalPages) return;
    void fetchBooks(page + 1, true);
  };

  const refresh = () => fetchBooks(1, false);

  const updateBookmark = (id: string, bookmarked: boolean) => {
    setBooks((current) =>
      current.map((book) => (book.id === id ? { ...book, isBookmarked: bookmarked } : book))
    );
  };

  return {
    books,
    loading,
    loadingMore,
    error,
    searchQuery,
    activeTab,
    sortBy,
    page,
    totalBooks,
    totalPages,
    setSearchQuery,
    setActiveTab,
    cycleSort,
    loadMore,
    refresh,
    updateBookmark,
  };
}
