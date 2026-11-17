import { RotateCw } from 'lucide-react';

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  totalBooks: number;
  loadedCount: number;
  loading: boolean;
  onLoadMore: () => void;
}

export function CatalogPagination({
  page,
  totalPages,
  totalBooks,
  loadedCount,
  loading,
  onLoadMore,
}: CatalogPaginationProps) {
  return (
    <div className="pt-2 text-center space-y-2">
      <button
        onClick={onLoadMore}
        disabled={page >= totalPages || loading}
        className="w-full py-2.5 bg-white border border-blue-200 text-blue-700 font-semibold text-xs rounded-xl hover:bg-blue-50 flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
      >
        <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
        <span>Muat Lebih Banyak Koleksi</span>
      </button>

      <p className="text-[11px] text-slate-500">
        Menampilkan {loadedCount} dari {totalBooks} Buku • Halaman {page} dari {totalPages}
      </p>
    </div>
  );
}
