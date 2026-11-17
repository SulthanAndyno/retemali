import { BookOpen, Clock, Edit2, LogIn, Trash2 } from 'lucide-react';
import type { CatalogBook } from '../types/catalog.types';

interface DetailActionBarProps {
  book: CatalogBook;
  loggedIn: boolean;
  actionLoading: boolean;
  canManage: boolean;
  canDelete: boolean;
  deleting: boolean;
  onReserve: () => void;
  onLogin: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DetailActionBar({
  book,
  loggedIn,
  actionLoading,
  canManage,
  canDelete,
  deleting,
  onReserve,
  onLogin,
  onEdit,
  onDelete,
}: DetailActionBarProps) {
  const isAvailable = book.status === 'AVAILABLE' && book.availableStock > 0;

  return (
    <div className="p-4 bg-white border-t border-slate-100 shadow-xl shrink-0 space-y-2">
      {loggedIn ? (
        isAvailable ? (
          <button
            onClick={onReserve}
            disabled={actionLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <BookOpen size={16} />
            <span>{actionLoading ? 'Sedang Memproses...' : 'Ajukan Pinjam Sekarang'}</span>
          </button>
        ) : (
          <button
            onClick={onReserve}
            disabled={actionLoading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Clock size={16} />
            <span>{actionLoading ? 'Memproses Reservasi...' : 'Masuk Antrean Reservasi'}</span>
          </button>
        )
      ) : (
        <button
          onClick={onLogin}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <LogIn size={16} />
          <span>Masuk Akun untuk Meminjam</span>
        </button>
      )}

      {canManage && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit2 size={13} className="text-blue-600" />
            <span>Edit Data Buku</span>
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} className="text-rose-600" />
              <span>{deleting ? 'Menghapus...' : 'Hapus (Admin)'}</span>
            </button>
          )}
        </div>
      )}

      <p className="text-[10px] text-center text-slate-400">
        Peminjaman 100% gratis untuk seluruh warga &amp; komunitas Rete Mali.
      </p>
    </div>
  );
}
