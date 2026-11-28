import Image from 'next/image';
import { BookOpen, ChevronRight, Edit2, Heart, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { getImageUrl } from '@/shared/lib/utils';
import { getBookAgeGroupTone } from '../lib/book-category';
import { formatBookRating } from '../lib/catalog-query';
import type { CatalogBook } from '../types/catalog.types';

interface BookCardProps {
  book: CatalogBook;
  canManage: boolean;
  canDelete: boolean;
  deleting: boolean;
  onOpen: () => void;
  onBookmark: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BookCard({
  book,
  canManage,
  canDelete,
  deleting,
  onOpen,
  onBookmark,
  onEdit,
  onDelete,
}: BookCardProps) {
  const isAvailable = book.status === 'AVAILABLE' && book.availableStock > 0;

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group">
      <div>
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
          {book.coverImage ? (
            <Image
              src={getImageUrl(book.coverImage)}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col items-center justify-center p-2 text-center">
              <BookOpen size={30} className="text-blue-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 line-clamp-2 px-1">
                {book.title}
              </span>
            </div>
          )}

          <div className="absolute top-2 left-2 z-10">
            {isAvailable ? (
              <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                Tersedia
              </span>
            ) : (
              <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                Dipinjam
              </span>
            )}
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onBookmark();
            }}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors shadow-sm"
          >
            <Heart
              size={15}
              className={book.isBookmarked ? 'fill-rose-500 text-rose-500' : ''}
            />
          </button>

          <div className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 backdrop-blur-xs">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{formatBookRating(book.rating)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-medium text-slate-600">{book.shelfLocation}</span>
          <span className={`font-semibold ${isAvailable ? 'text-blue-600' : 'text-amber-600'}`}>
            {book.availableStock}/{book.totalStock} Stok
          </span>
        </div>

        <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight mb-0.5">
          {book.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">{book.author}</p>
        {book.ageGroup ? (
          <div className="mb-2">
            <Badge tone={getBookAgeGroupTone(book.ageGroup)}>
              {book.ageGroup}
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {isAvailable ? (
          <button
            onClick={onOpen}
            className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            Lihat Detail <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={onOpen}
            className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            Ajukan Peminjaman
          </button>
        )}

        {canManage && (
          <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="flex-1 py-1 px-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1"
            >
              <Edit2 size={11} className="text-blue-600" />
              <span>Edit</span>
            </button>
            {canDelete && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
                disabled={deleting}
                className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Trash2 size={11} className="text-rose-600" />
                <span>{deleting ? '...' : 'Hapus'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
