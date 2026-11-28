'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, SearchX } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { BOOK_CATEGORY_OPTIONS } from '../lib/book-category';
import { usePublicCatalog } from '../hooks/use-public-catalog';
import type { PublicBookSort } from '../api/books.api';
import type { BookAgeGroup } from '../types/book.types';
import { PublicBookCard } from '../components/public-book-card';
import { BookFilterBar } from '../components/book-filter-bar';
import { EmptyState } from '@/shared/components/ui/empty-state';

interface CatalogPageProps {
  initialSearch?: string;
  initialCategory?: string;
  initialAgeGroup?: BookAgeGroup | 'ALL';
  initialAvailableOnly?: boolean;
  initialSort?: PublicBookSort;
  initialPage?: number;
}

const SORT_OPTIONS: { value: PublicBookSort; label: string }[] = [
  { value: 'title-asc', label: 'Judul A–Z' },
  { value: 'title-desc', label: 'Judul Z–A' },
  { value: 'newest', label: 'Terbaru ditambahkan' },
  { value: 'popular', label: 'Terpopuler' },
  { value: 'rating', label: 'Rating tertinggi' },
];

const CATEGORY_FILTER_GROUPS = [
  {
    options: [
      { value: 'ALL', label: 'Semua Kategori' },
      ...BOOK_CATEGORY_OPTIONS,
    ],
  },
];

export function CatalogPage({
  initialSearch = '',
  initialCategory = 'ALL',
  initialAgeGroup = 'ALL',
  initialAvailableOnly = false,
  initialSort = 'title-asc',
  initialPage = 1,
}: CatalogPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [term, setTerm] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [ageGroup, setAgeGroup] = useState<BookAgeGroup | 'ALL'>(initialAgeGroup);
  const [availableOnly, setAvailableOnly] = useState(initialAvailableOnly);
  const [sortBy, setSortBy] = useState<PublicBookSort>(initialSort);
  const [page, setPage] = useState(initialPage);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(term), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [term]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('cari', search);
    if (category !== 'ALL') params.set('kategori', category);
    if (ageGroup !== 'ALL') params.set('usia', ageGroup);
    if (availableOnly) params.set('tersedia', '1');
    if (sortBy !== 'title-asc') params.set('urut', sortBy);
    if (page > 1) params.set('hal', String(page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [ageGroup, availableOnly, category, page, pathname, router, search, sortBy]);

  const catalog = usePublicCatalog({
    search,
    category,
    ageGroup,
    availableOnly,
    sortBy,
    page,
  });

  const resetFilters = () => {
    setTerm('');
    setSearch('');
    setCategory('ALL');
    setAgeGroup('ALL');
    setAvailableOnly(false);
    setSortBy('title-asc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Katalog Koleksi Buku"
        description="Jelajahi koleksi Taman Baca ReteMali — cari berdasarkan judul, penulis, atau kategori, lalu saring sesuai kebutuhan."
      />

      <BookFilterBar
        search={term}
        onSearchChange={(value) => {
          setTerm(value);
          setPage(1);
        }}
        searchPlaceholder="Cari judul, penulis, ISBN, atau rak…"
        filterTitle="Filter Buku"
        category={category}
        categoryGroups={CATEGORY_FILTER_GROUPS}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        ageGroup={ageGroup}
        onAgeGroupChange={(value) => {
          setAgeGroup(value);
          setPage(1);
        }}
        availableOnly={availableOnly}
        onAvailableOnlyChange={(value) => {
          setAvailableOnly(value);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOptions={SORT_OPTIONS}
        onSortChange={(value) => {
          setSortBy(value as PublicBookSort);
          setPage(1);
        }}
        onReset={resetFilters}
        activeFilterCount={
          (category !== 'ALL' ? 1 : 0) +
          (ageGroup !== 'ALL' ? 1 : 0) +
          (availableOnly ? 1 : 0)
        }
        statusText={
          catalog.loading
            ? 'Memperbarui hasil…'
            : `Menampilkan ${catalog.books.length} dari ${catalog.total} koleksi`
        }
      />

      {catalog.error ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{catalog.error}</p>
          <Button
            size="sm"
            variant="danger"
            onClick={() => void catalog.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : catalog.loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-card bg-white"
            />
          ))}
        </div>
      ) : catalog.books.length === 0 ? (
        <EmptyState
          icon={<SearchX aria-hidden />}
          title="Tidak ada buku yang cocok"
          description="Tidak ditemukan koleksi dengan kombinasi pencarian/filter tersebut. Coba ubah kata kunci atau atur ulang filter."
          action={
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Atur ulang filter
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.books.map((book) => (
            <PublicBookCard
              key={book.id}
              book={book}
              href={`/katalog/${book.id}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1 || catalog.loading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Koleksi sebelumnya
        </Button>
        <span className="text-xs text-ink-soft">
          Hal. {page} / {Math.max(1, catalog.totalPages)}
        </span>
        <Button
          size="sm"
          disabled={page >= catalog.totalPages || catalog.loading}
          onClick={() => setPage((current) => current + 1)}
        >
          Muat lebih banyak koleksi…
        </Button>
      </div>

      <Card className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          Ingin meminjam koleksi di atas? Peminjaman penuh tersedia untuk member
          terverifikasi.
        </p>
        <Link
          href="/login/daftar"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Daftar member baru
        </Link>
      </Card>
    </div>
  );
}
