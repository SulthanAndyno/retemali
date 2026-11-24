'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useToast } from '@/shared/components/ui/toast';
import { useAuth } from '@/features/auth';
import { getImageUrl } from '@/shared/lib/utils';
import { formatBookRating } from '../lib/catalog-query';
import { getBookCategoryLabel } from '../lib/book-category';
import { useBookDetail } from '../hooks/use-book-detail';
import { useBookMutations } from '../hooks/use-book-mutations';
import { EmptyState } from '@/shared/components/ui/empty-state';

export function CatalogDetailPage({ bookId }: { bookId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { book, loading, error, reload } = useBookDetail(bookId);
  const mutations = useBookMutations();
  const [bookmarked, setBookmarked] = useState(false);

  if (loading) {
    return <div className="h-72 animate-pulse rounded-card bg-white" />;
  }

  if (error || !book) {
    return (
      <div className="space-y-6">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke katalog
        </Link>
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">
            {error ?? 'Buku tidak ditemukan.'}
          </p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
        <EmptyState
          title="Detail buku tidak tersedia"
          description="Periksa kembali tautan atau pilih buku lain dari katalog."
        />
      </div>
    );
  }

  const available = book.availableStock > 0;
  const loginHref = `/login?next=${encodeURIComponent(`/katalog/${book.id}`)}`;

  const handleBookmark = async () => {
    if (!user) {
      router.push(loginHref);
      return;
    }

    const result = await mutations.toggleBookmark(book);
    if (result.bookmarked !== undefined) setBookmarked(result.bookmarked);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handleReserve = async () => {
    if (!user) {
      router.push(loginHref);
      return;
    }

    const result = await mutations.reserve(book);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-6">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke katalog
      </Link>

      <Card className="flex flex-wrap gap-6">
        {book.coverImage ? (
          <Image
            src={getImageUrl(book.coverImage)}
            alt={`Sampul buku ${book.title}`}
            width={200}
            height={288}
            className="h-72 w-50 shrink-0 rounded-field border border-surface-soft object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-72 w-50 shrink-0 items-center justify-center rounded-field bg-surface-blue text-4xl font-extrabold text-primary-deep"
          >
            {book.title.charAt(0)}
          </div>
        )}

        <div className="min-w-60 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{getBookCategoryLabel(book.category)}</Badge>
            <Badge tone={available ? 'success' : 'warning'}>
              {available
                ? `Tersedia ${book.availableStock}/${book.totalStock}`
                : 'Dipinjam semua'}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
              <Star
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                aria-hidden
              />
              {formatBookRating(book.rating)}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-primary-deep">
            {book.title}
          </h1>
          <p className="text-sm text-ink-soft">
            {book.author}
            {book.publisher ? ` • ${book.publisher}` : ''}
            {book.publishYear ? ` • ${book.publishYear}` : ''}
          </p>
          <p className="text-sm text-ink-soft">
            Rak: <span className="font-semibold text-ink">{book.shelfLocation}</span>
            {book.isbn ? ` • ISBN ${book.isbn}` : ''}
          </p>

          {book.synopsis ? (
            <p className="text-sm leading-relaxed text-ink-soft">
              {book.synopsis}
            </p>
          ) : (
            <p className="text-sm text-ink-soft">Sinopsis belum tersedia.</p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => void handleBookmark()}
              disabled={mutations.actionLoading}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? 'fill-primary-deep' : ''}`}
                aria-hidden
              />
              {bookmarked ? 'Tersimpan' : 'Simpan Bacaan'}
            </Button>
            <Button
              onClick={() => void handleReserve()}
              loading={mutations.actionLoading}
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Peminjaman Buku
            </Button>
          </div>

          {!user ? (
            <p className="text-xs text-ink-soft">
              Masuk ke akun member untuk peminjaman dan menyimpan bacaan.{' '}
              <Link
                href={loginHref}
                className="font-semibold text-primary-deep underline-offset-4 hover:underline"
              >
                Masuk sekarang
              </Link>
            </p>
          ) : null}
        </div>
      </Card>

      <div>
        <LinkButton href="/katalog" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke katalog
        </LinkButton>
      </div>
    </div>
  );
}
