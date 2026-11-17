import { BookOpen } from 'lucide-react';

export function AuthHero() {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
        <BookOpen size={32} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Selamat Datang di ReteMali
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed">
        Temukan buku, ikuti kegiatan komunitas, dan tumbuh bersama Taman Baca
        ReteMali.
      </p>
    </div>
  );
}
