import { ChevronRight } from 'lucide-react';
import type { Book } from '../types/book.types';
import { PopularBookCard } from './popular-book-card';

interface HomePopularBooksProps {
  books: Book[];
  onViewAll: () => void;
  onOpenBook: (book: Book) => void;
  onBookmark: (book: Book) => void;
}

export function HomePopularBooks({
  books,
  onViewAll,
  onOpenBook,
  onBookmark,
}: HomePopularBooksProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
            Koleksi Populer
          </h3>
          <p className="text-[11px] text-slate-500 leading-tight">
            Paling sering dibaca minggu ini
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>Lihat Semua</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">Belum ada koleksi populer</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {books.map((book) => (
            <PopularBookCard
              key={book.id}
              book={book}
              onOpen={() => onOpenBook(book)}
              onBookmark={() => onBookmark(book)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
