import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/shared/components/ui/badge';
import { getImageUrl } from '@/shared/lib/utils';
import { getBookCategoryLabel } from '../lib/book-category';
import type { Book } from '../types/book.types';

export function PublicBookCard({ book, href }: { book: Book; href: string }) {
  const available = book.availableStock > 0;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-card border border-surface-soft bg-white shadow-card transition-shadow hover:shadow-drawer"
    >
      {book.coverImage ? (
        <Image
          src={getImageUrl(book.coverImage)}
          alt={`Sampul buku ${book.title}`}
          width={352}
          height={512}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-surface-blue">
          <span className="truncate px-4 text-sm font-extrabold uppercase tracking-wide text-primary-deep">
            {getBookCategoryLabel(book.category)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 font-bold leading-snug text-ink">
          {book.title}
        </h3>
        <p className="truncate text-sm text-ink-soft">{book.author}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge tone="info">{getBookCategoryLabel(book.category)}</Badge>
          {available ? (
            <Badge tone="success">
              {book.availableStock === book.totalStock
                ? `${book.totalStock} Eksemplar Ada`
                : `Tersedia (${book.availableStock})`}
            </Badge>
          ) : (
            <Badge tone="warning">Dipinjam semua</Badge>
          )}
        </div>
        <span className="mt-auto pt-3 text-sm font-semibold text-primary-deep underline-offset-4 group-hover:underline">
          Detail Buku
        </span>
      </div>
    </Link>
  );
}
