import { CheckCircle } from 'lucide-react';

interface RegisterSuccessCardProps {
  code: string;
  onContinue: () => void;
}

export function RegisterSuccessCard({ code, onContinue }: RegisterSuccessCardProps) {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Pendaftaran Berhasil! 🎉
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Akun Anda telah dibuat. Gunakan kode member berikut untuk referensi Anda.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-1">Kode Member Anda</p>
          <p className="text-2xl font-bold text-blue-600 tracking-widest">{code}</p>
        </div>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
          Akun Anda memerlukan validasi admin sebelum dapat mengakses fitur
          peminjaman buku. Harap tunggu konfirmasi.
        </p>
        <button
          onClick={onContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Masuk ke Akun
        </button>
      </div>
    </div>
  );
}
