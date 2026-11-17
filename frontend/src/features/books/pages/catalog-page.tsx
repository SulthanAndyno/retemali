'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { BOOK_CATEGORY_OPTIONS } from '../lib/book-category';
import { usePublicCatalog } from '../hooks/use-public-catalog';
import type { PublicBookSort } from '../api/books.api';
import { PublicBookCard } from '../components/public-book-card';
import { PublicEmptyState } from '../components/public-empty-state';

interface CatalogPageProps {
  initialSearch?: string;
  initialCategory?: string;
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

const fieldClasses =
  'w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const chipBase =
  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors';
const chipIdle =
  'border-surface-soft bg-white text-ink-soft hover:border-primary/50';
const chipActive = 'border-primary bg-primary text-white';

export function CatalogPage({
  initialSearch = '',
  initialCategory = 'ALL',
  initialAvailableOnly = false,
  initialSort = 'title-asc',
  initialPage = 1,
}: CatalogPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [term, setTerm] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
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
    if (availableOnly) params.set('tersedia', '1');
    if (sortBy !== 'title-asc') params.set('urut', sortBy);
    if (page > 1) params.set('hal', String(page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [availableOnly, category, page, pathname, router, search, sortBy]);

  const catalog = usePublicCatalog({
    search,
    category,
    availableOnly,
    sortBy,
    page,
  });

  const resetFilters = () => {
    setTerm('');
    setSearch('');
    setCategory('ALL');
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

      <section
        aria-label="Pencarian dan filter katalog"
        className="rounded-card border border-surface-soft bg-white p-4 shadow-card"
      >
        <div className="relative">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
            aria-hidden
          >
            <BookOpen className="h-4 w-4" />
          </span>
          <input
            id="katalog-cari"
            type="search"
            aria-label="Cari judul buku, penulis, atau kategori"
            placeholder="Cari judul buku, penulis, atau kategori…"
            className={`${fieldClasses} pl-10`}
            value={term}
            onChange={(event) => {
              setTerm(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter kategori"
        >
          <button
            type="button"
            aria-pressed={category === 'ALL'}
            onClick={() => {
              setCategory('ALL');
              setPage(1);
            }}
            className={`${chipBase} ${category === 'ALL' ? chipActive : chipIdle}`}
          >
            Semua
          </button>
          {BOOK_CATEGORY_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => {
                setCategory(item.value);
                setPage(1);
              }}
              className={`${chipBase} ${
                category === item.value ? chipActive : chipIdle
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-pressed={availableOnly}
            onClick={() => {
              setAvailableOnly((current) => !current);
              setPage(1);
            }}
            className={`${chipBase} ${
              availableOnly
                ? 'border-success bg-green-50 text-success'
                : chipIdle
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Tersedia saja
            </span>
          </button>
          <label
            htmlFor="katalog-urut"
            className="flex items-center gap-2 text-xs font-semibold text-ink-soft"
          >
            Urutkan
            <select
              id="katalog-urut"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as PublicBookSort);
                setPage(1);
              }}
              className="rounded-field border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p
          className="mt-3 border-t border-surface-soft pt-3 text-xs text-ink-soft"
          role="status"
          aria-live="polite"
        >
          {catalog.loading
            ? 'Memperbarui hasil…'
            : `Menampilkan ${catalog.books.length} dari ${catalog.total} koleksi`}
        </p>
      </section>

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
        <PublicEmptyState
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
          href="/register"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Daftar member baru
        </Link>
      </Card>
    </div>
  );
}
