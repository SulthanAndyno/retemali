import { BookOpen } from 'lucide-react';
import type { CatalogBook } from '../types/catalog.types';
import { BookCard } from './book-card';
import { BookCardSkeleton } from './book-card-skeleton';

interface BookGridProps {
  loading: boolean;
  books: CatalogBook[];
  canManage: boolean;
  canDelete: boolean;
  deletingId: string | null;
  onOpen: (book: CatalogBook) => void;
  onBookmark: (book: CatalogBook) => void;
  onEdit: (book: CatalogBook) => void;
  onDelete: (book: CatalogBook) => void;
}

export function BookGrid({
  loading,
  books,
  canManage,
  canDelete,
  deletingId,
  onOpen,
  onBookmark,
  onEdit,
  onDelete,
}: BookGridProps) {
  if (loading) return <BookCardSkeleton />;

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
        <BookOpen size={40} className="mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-semibold text-slate-700">Tidak ada buku ditemukan</p>
        <p className="text-xs text-slate-500 mt-1">
          Coba kata kunci lain atau reset filter kategori.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          canManage={canManage}
          canDelete={canDelete}
          deleting={deletingId === book.id}
          onOpen={() => onOpen(book)}
          onBookmark={() => onBookmark(book)}
          onEdit={() => onEdit(book)}
          onDelete={() => onDelete(book)}
        />
      ))}
    </div>
  );
}
