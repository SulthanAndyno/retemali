import { Bookmark } from 'lucide-react';
import { getBookCategoryLabel } from '../lib/book-category';
import { getBookStatusLabel } from '../lib/home-format';
import type { Book } from '../types/book.types';
import { BookCover } from './book-cover';

interface PopularBookCardProps {
  book: Book;
  onOpen: () => void;
  onBookmark: () => void;
}

export function PopularBookCard({ book, onOpen, onBookmark }: PopularBookCardProps) {
  const isAvailable = book.status === 'AVAILABLE';
  const statusLabel = getBookStatusLabel(book.status);
  const statusClass =
    book.status === 'AVAILABLE'
      ? 'bg-emerald-500 text-white'
      : book.status === 'MAINTENANCE'
        ? 'bg-slate-500 text-white'
        : 'bg-amber-500 text-white';

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div>
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col items-center justify-center p-2 text-center mb-2">
          <BookCover title={book.title} coverImage={book.coverImage ?? null} />

          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>

          <button
            onClick={onBookmark}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-slate-600"
          >
            <Bookmark size={13} />
          </button>
        </div>

        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
          {getBookCategoryLabel(book.category)}
        </p>
        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
          {book.title}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">{book.author}</p>
      </div>

      <button
        onClick={onOpen}
        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
          isAvailable
            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {isAvailable ? 'Pinjam Buku' : 'Reservasi'}
      </button>
    </div>
  );
}
