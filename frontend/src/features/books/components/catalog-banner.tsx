import { BookOpen, Plus } from 'lucide-react';

interface CatalogBannerProps {
  totalBooks: number;
  canCreate: boolean;
  onCreate: () => void;
}

export function CatalogBanner({ totalBooks, canCreate, onCreate }: CatalogBannerProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-blue-600 mb-1">
          <BookOpen size={16} className="text-blue-600" />
          <span className="text-xs font-bold tracking-wider uppercase">Koleksi Warga</span>
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Tambah Buku</span>
          </button>
        )}
      </div>
      <h1 className="text-xl font-extrabold text-slate-900 leading-snug">
        Katalog Buku Perpustakaan
      </h1>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
        Jelajahi {totalBooks.toLocaleString('id-ID')} koleksi buku bacaan &amp; ensiklopedia
        RT05 RW14 Jatirangga.
      </p>
    </section>
  );
}
