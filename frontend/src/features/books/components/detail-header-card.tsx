import Image from 'next/image';
import { BookOpen, Info, MapPin, Star } from 'lucide-react';
import { getImageUrl } from '@/shared/lib/utils';
import { getBookCategoryLabel } from '../lib/book-category';
import { formatBookRating } from '../lib/catalog-query';
import { getBookStatusLabel } from '../lib/home-format';
import type { CatalogBook } from '../types/catalog.types';

interface DetailHeaderCardProps {
  book: CatalogBook;
}

export function DetailHeaderCard({ book }: DetailHeaderCardProps) {
  const isAvailable = book.status === 'AVAILABLE' && book.availableStock > 0;

  return (
    <>
      <div className="flex gap-4 items-start bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white p-3.5 rounded-2xl border border-blue-100/70">
        <div className="relative w-20 h-28 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white shrink-0 shadow-md p-1.5 text-center overflow-hidden">
          {book.coverImage ? (
            <Image
              src={getImageUrl(book.coverImage)}
              alt={book.title}
              fill
              className="object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-2xs" />
              <BookOpen size={24} className="relative z-10 mb-1" />
              <span className="relative z-10 text-[9px] font-bold line-clamp-2 px-1">
                {book.title}
              </span>
            </>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                isAvailable
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {isAvailable ? 'Tersedia' : getBookStatusLabel(book.status)}
            </span>

            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {getBookCategoryLabel(book.category)}
            </span>
          </div>

          <h2 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
            {book.title}
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Penulis: {book.author}
          </p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">ID: {book.bookCode}</p>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
            <span className="font-bold text-amber-600 flex items-center gap-0.5">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              {formatBookRating(book.rating)}
            </span>
            <span>•</span>
            <span>{book.borrowCount}x Dipinjam</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
            <MapPin size={13} className="text-blue-600" />
            <span>Lokasi Rak Fisik</span>
          </div>
          <p className="font-extrabold text-sm text-slate-900">{book.shelfLocation}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Saung Rete Mali</p>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-blue-600 text-[11px] mb-1">
            <BookOpen size={13} />
            <span>Stok Tersedia</span>
          </div>
          <p className="font-extrabold text-sm text-blue-700">
            {book.availableStock} Unit
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            dari {book.totalStock} Total Stok
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-slate-900 mb-1.5">Sinopsis &amp; Ringkasan</h4>
        {book.loanCode ? (
          <p className="text-xs text-amber-700 leading-relaxed mb-2">
            Buku ini sedang Anda pinjam (Kode Pinjam: {book.loanCode}
            {book.dueDate
              ? `, Jatuh Tempo: ${new Date(book.dueDate).toLocaleDateString('id-ID')}`
              : ''}
            ).
          </p>
        ) : null}
        <p className="text-xs text-slate-600 leading-relaxed">
          {book.synopsis || 'Belum ada sinopsis untuk buku ini.'}
        </p>
      </div>

      <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-3.5 space-y-2 text-xs">
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Info size={14} className="text-blue-600" />
          <span>Ketentuan Peminjaman Rete Mali</span>
        </h4>
        <ul className="space-y-1 text-[11px] text-slate-600 pl-4 list-disc">
          <li>
            Durasi peminjaman standar: <strong>7 hari kalender</strong>.
          </li>
          <li>Dapat diperpanjang 1 kali (+7 hari) melalui dashboard.</li>
          <li>Ambil buku di Loket Sirkulasi dengan menunjukkan QR/Kode anggota.</li>
          <li>Reservasi berlaku 48 jam sebelum dialihkan ke antrean berikutnya.</li>
        </ul>
      </div>
    </>
  );
}
