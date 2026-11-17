import { BookOpen } from 'lucide-react';

export function BorrowingsEmptyState() {
  return (
    <div className="py-10 text-center space-y-1">
      <BookOpen size={26} className="text-slate-300 mx-auto" />
      <p className="text-xs font-semibold text-slate-600">Tidak ada data peminjaman</p>
      <p className="text-[10px] text-slate-400">
        Coba ubah filter status atau kata kunci pencarian.
      </p>
    </div>
  );
}
