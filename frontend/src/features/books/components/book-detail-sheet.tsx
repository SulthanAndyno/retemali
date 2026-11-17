import { Bookmark, Info, X } from 'lucide-react';
import type { CatalogBook } from '../types/catalog.types';
import { DetailActionBar } from './detail-action-bar';
import { DetailHeaderCard } from './detail-header-card';

interface BookDetailSheetProps {
  book: CatalogBook;
  loggedIn: boolean;
  actionLoading: boolean;
  canManage: boolean;
  canDelete: boolean;
  deleting: boolean;
  onClose: () => void;
  onBookmark: () => void;
  onReserve: () => void;
  onLogin: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BookDetailSheet({
  book,
  loggedIn,
  actionLoading,
  canManage,
  canDelete,
  deleting,
  onClose,
  onBookmark,
  onReserve,
  onLogin,
  onEdit,
  onDelete,
}: BookDetailSheetProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:items-center sm:justify-center p-0 transition-opacity">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="w-full max-w-md h-[95dvh] sm:h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 relative z-10">
        <div className="px-5 pt-3 pb-2.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="text-center">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1.5" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detail &amp; Peminjaman
            </h3>
          </div>

          <button
            onClick={onBookmark}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-blue-600 flex items-center justify-center transition-colors"
            aria-label="Simpan Buku"
            title="Simpan Bacaan"
          >
            <Bookmark
              size={16}
              className={book.isBookmarked ? 'fill-blue-600 text-blue-600' : ''}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <DetailHeaderCard book={book} />

          {!loggedIn && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <p className="font-bold">Perhatian untuk Tamu</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Anda belum masuk ke akun. Silakan tekan tombol di bawah untuk masuk
                  agar formulir reservasi buku dapat langsung diproses ke loket
                  sirkulasi.
                </p>
              </div>
            </div>
          )}
        </div>

        <DetailActionBar
          book={book}
          loggedIn={loggedIn}
          actionLoading={actionLoading}
          canManage={canManage}
          canDelete={canDelete}
          deleting={deleting}
          onReserve={onReserve}
          onLogin={onLogin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
