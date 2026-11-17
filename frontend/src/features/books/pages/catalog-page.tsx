'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/features/auth';
import { useCatalogBooks } from '../hooks/use-catalog-books';
import { useBookMutations } from '../hooks/use-book-mutations';
import { useBookForm } from '../hooks/use-book-form';
import {
  canCreateBook,
  canDeleteBook,
  canManageBook,
} from '../lib/catalog-permissions';
import { resolveCatalogTab } from '../lib/catalog-query';
import type { CatalogBook } from '../types/catalog.types';
import { CatalogBanner } from '../components/catalog-banner';
import { CatalogToolbar } from '../components/catalog-toolbar';
import { CategoryFilterPills } from '../components/category-filter-pills';
import { BookGrid } from '../components/book-grid';
import { CatalogPagination } from '../components/catalog-pagination';
import { QuickScanBar } from '../components/quick-scan-bar';
import { CatalogToast } from '../components/catalog-toast';
import { BookDetailSheet } from '../components/book-detail-sheet';
import { BookFormModal } from '../components/book-form-modal';

interface CatalogPageProps {
  initialSearch?: string;
  initialCategory?: string;
}

type Notification = { message: string; type: 'success' | 'error' } | null;

export function CatalogPage({
  initialSearch = '',
  initialCategory = 'ALL',
}: CatalogPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const catalog = useCatalogBooks(initialSearch, resolveCatalogTab(initialCategory));
  const mutations = useBookMutations();

  const [selectedBook, setSelectedBook] = useState<CatalogBook | null>(null);
  const [notification, setNotification] = useState<Notification>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useBookForm({
    canCreate: canCreateBook(user?.role),
    onSaved: catalog.refresh,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setNotification({ message, type });
    toastTimerRef.current = setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const requireLogin = () => {
    router.push('/login');
  };

  const handleBookmark = async (book: CatalogBook) => {
    if (!user) {
      requireLogin();
      return;
    }

    const result = await mutations.toggleBookmark(book);
    if (result.ok && result.bookmarked !== undefined) {
      catalog.updateBookmark(book.id, result.bookmarked);
      setSelectedBook((current) =>
        current?.id === book.id
          ? { ...current, isBookmarked: result.bookmarked }
          : current
      );
    }
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleReserve = async (book: CatalogBook) => {
    if (!user) {
      requireLogin();
      return;
    }

    const result = await mutations.reserve(book);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      setSelectedBook(null);
      await catalog.refresh();
    }
  };

  const handleDelete = async (book: CatalogBook) => {
    if (
      !confirm(
        `Hapus buku "${book.title}" (${book.bookCode}) secara permanen dari sistem?`
      )
    ) {
      return;
    }

    const result = await mutations.remove(book);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      setSelectedBook(null);
      await catalog.refresh();
    }
  };

  const handleSubmit = async () => {
    const result = await form.submit();
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) setSelectedBook(null);
  };

  const handleResetFilters = () => {
    catalog.setActiveTab('ALL');
    catalog.setSearchQuery('');
  };

  const canManage = canManageBook(user?.role);
  const canDelete = canDeleteBook(user?.role);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/50 pb-24 text-slate-800">
      <CatalogToast notification={notification} />
      <Header />

      <main className="px-4 pt-3 space-y-4">
        <CatalogBanner
          totalBooks={catalog.totalBooks}
          canCreate={canCreateBook(user?.role)}
          onCreate={form.openCreate}
        />

        <CatalogToolbar
          searchQuery={catalog.searchQuery}
          sortBy={catalog.sortBy}
          onSearchChange={catalog.setSearchQuery}
          onCycleSort={catalog.cycleSort}
          onReset={handleResetFilters}
        />

        <CategoryFilterPills
          activeTab={catalog.activeTab}
          onSelect={catalog.setActiveTab}
        />

        {catalog.error && !catalog.loading ? (
          <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-xs text-rose-700">{catalog.error}</p>
            <button
              type="button"
              onClick={() => void catalog.refresh()}
              className="text-[10px] font-bold text-rose-700 hover:underline shrink-0"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <BookGrid
            loading={catalog.loading}
            books={catalog.books}
            canManage={canManage}
            canDelete={canDelete}
            deletingId={mutations.deletingId}
            onOpen={setSelectedBook}
            onBookmark={handleBookmark}
            onEdit={form.openEdit}
            onDelete={handleDelete}
          />
        )}

        <QuickScanBar onScan={() => router.push('/dashboard/volunteer')} />

        <CatalogPagination
          page={catalog.page}
          totalPages={catalog.totalPages}
          totalBooks={catalog.totalBooks}
          loadedCount={catalog.books.length}
          loading={catalog.loadingMore}
          onLoadMore={catalog.loadMore}
        />
      </main>

      {selectedBook && (
        <BookDetailSheet
          book={selectedBook}
          loggedIn={Boolean(user)}
          actionLoading={mutations.actionLoading}
          canManage={canManage}
          canDelete={canDelete}
          deleting={mutations.deletingId === selectedBook.id}
          onClose={() => setSelectedBook(null)}
          onBookmark={() => void handleBookmark(selectedBook)}
          onReserve={() => void handleReserve(selectedBook)}
          onLogin={requireLogin}
          onEdit={() => form.openEdit(selectedBook)}
          onDelete={() => void handleDelete(selectedBook)}
        />
      )}

      <BookFormModal
        open={form.formOpen}
        editingBook={form.editingBook}
        form={form.form}
        coverPreview={form.coverPreview}
        submitting={form.submitting}
        role={user?.role}
        onChange={form.setField}
        onCoverChange={form.selectCover}
        onClose={form.close}
        onSubmit={() => void handleSubmit()}
      />

      <BottomNav />
    </div>
  );
}
