'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Plus } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SectionTitle } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { useCatalogBooks } from '../hooks/use-catalog-books';
import { useBookMutations } from '../hooks/use-book-mutations';
import { useBookForm } from '../hooks/use-book-form';
import { getBookAgeGroupTone, getBookCategoryLabel, BOOK_CATEGORY_OPTIONS } from '../lib/book-category';
import { formatBookRating, resolveCatalogTab } from '../lib/catalog-query';
import type { BookAgeGroup } from '../types/book.types';
import type {
  CatalogBook,
  CatalogSort,
  CatalogTab,
} from '../types/catalog.types';
import { BookFilterBar } from '../components/book-filter-bar';
import { CatalogPagination } from '../components/catalog-pagination';
import { CatalogToast } from '../components/catalog-toast';
import { BookFormModal } from '../components/book-form-modal';

type Notification = { message: string; type: 'success' | 'error' } | null;

const ADMIN_FILTER_GROUPS = [
  {
    options: [{ value: 'ALL', label: 'Semua Buku' }],
  },
  {
    label: 'Status',
    options: [
      { value: 'AVAILABLE', label: 'Tersedia' },
      { value: 'BORROWED', label: 'Sedang Dipinjam' },
    ],
  },
  {
    label: 'Kategori',
    options: BOOK_CATEGORY_OPTIONS,
  },
];

const ADMIN_SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'popular', label: 'Terpopuler' },
  { value: 'rating', label: 'Rating tertinggi' },
];

interface AdminBooksPageProps {
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: CatalogSort;
  initialPage?: number;
  initialAgeGroup?: BookAgeGroup | 'ALL';
}

export function AdminBooksPage({
  initialSearch = '',
  initialCategory = 'ALL',
  initialSort = 'newest',
  initialPage = 1,
  initialAgeGroup = 'ALL',
}: AdminBooksPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const catalog = useCatalogBooks(
    initialSearch,
    resolveCatalogTab(initialCategory),
    initialSort,
    initialPage,
    initialAgeGroup
  );
  const mutations = useBookMutations();
  const form = useBookForm({ canCreate: true, onSaved: catalog.refresh });
  const [notification, setNotification] = useState<Notification>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message, type });
    timerRef.current = setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (catalog.searchQuery) params.set('cari', catalog.searchQuery);
    if (catalog.activeTab !== 'ALL') params.set('kategori', catalog.activeTab);
    if (catalog.ageGroup !== 'ALL') params.set('usia', catalog.ageGroup);
    if (catalog.sortBy !== 'newest') params.set('urut', catalog.sortBy);
    if (catalog.page > 1) params.set('hal', String(catalog.page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [
    catalog.searchQuery,
    catalog.activeTab,
    catalog.ageGroup,
    catalog.sortBy,
    catalog.page,
    pathname,
    router,
  ]);

  const handleDelete = async (book: CatalogBook) => {
    if (!confirm(`Hapus buku "${book.title}" secara permanen?`)) return;
    const result = await mutations.remove(book);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) await catalog.refresh();
  };

  const handleSubmit = async () => {
    const result = await form.submit();
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <CatalogToast notification={notification} />
      <SectionTitle
        title="Manajemen Buku"
        description="Katalog, stok, dan sampul buku."
        action={
          <Button size="sm" onClick={form.openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah Buku
          </Button>
        }
      />

      <BookFilterBar
        search={catalog.searchQuery}
        onSearchChange={catalog.setSearchQuery}
        searchPlaceholder="Cari judul, penulis, ISBN, atau rak…"
        filterTitle="Filter Buku"
        category={catalog.activeTab}
        categoryGroups={ADMIN_FILTER_GROUPS}
        categoryLabel="Kategori / Status"
        onCategoryChange={(value) => catalog.setActiveTab(value as CatalogTab)}
        ageGroup={catalog.ageGroup}
        onAgeGroupChange={catalog.setAgeGroup}
        sortBy={catalog.sortBy}
        sortOptions={ADMIN_SORT_OPTIONS}
        onSortChange={(value) => catalog.setSort(value as CatalogSort)}
        onReset={() => {
          catalog.setActiveTab('ALL');
          catalog.setAgeGroup('ALL');
          catalog.setSort('newest');
          catalog.setSearchQuery('');
        }}
        activeFilterCount={
          (catalog.activeTab !== 'ALL' ? 1 : 0) +
          (catalog.ageGroup !== 'ALL' ? 1 : 0)
        }
        statusText={
          catalog.loading
            ? 'Memperbarui data…'
            : `Menampilkan ${catalog.books.length} dari ${catalog.totalBooks} buku`
        }
      />

      {catalog.error ? (
        <div className="flex items-center justify-between rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{catalog.error}</p>
          <Button size="sm" variant="danger" onClick={() => void catalog.refresh()}>
            Coba Lagi
          </Button>
        </div>
      ) : catalog.loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : catalog.books.length === 0 ? (
        <EmptyState title="Belum ada buku" description="Tambahkan koleksi baru." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Buku</TH>
              <TH>Kategori</TH>
              <TH>Usia</TH>
              <TH>Stok</TH>
              <TH>Rating</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {catalog.books.map((book) => (
              <TR key={book.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-10 overflow-hidden rounded bg-slate-100">
                      {book.coverImage ? (
                        <Image
                          src={getImageUrl(book.coverImage)}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <BookOpen className="m-auto h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{book.title}</p>
                      <p className="text-xs text-ink-soft">{book.author}</p>
                    </div>
                  </div>
                </TD>
                <TD>{getBookCategoryLabel(book.category)}</TD>
                <TD>
                  {book.ageGroup ? (
                    <Badge tone={getBookAgeGroupTone(book.ageGroup)}>
                      {book.ageGroup}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TD>
                <TD>
                  {book.availableStock}/{book.totalStock}
                </TD>
                <TD>{formatBookRating(book.rating)}</TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => form.openEdit(book)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void handleDelete(book)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <CatalogPagination
        page={catalog.page}
        totalPages={catalog.totalPages}
        totalBooks={catalog.totalBooks}
        loadedCount={catalog.books.length}
        loading={catalog.loadingMore}
        onLoadMore={catalog.loadMore}
      />

      <BookFormModal
        open={form.formOpen}
        editingBook={form.editingBook}
        form={form.form}
        coverPreview={form.coverPreview}
        submitting={form.submitting}
        role="ADMIN"
        onChange={form.setField}
        onCoverChange={form.selectCover}
        onClose={form.close}
        onSubmit={() => void handleSubmit()}
      />
    </div>
  );
}
