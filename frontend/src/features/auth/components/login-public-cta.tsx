import { ArrowRight } from 'lucide-react';

interface LoginPublicCtaProps {
  onOpen: () => void;
}

export function LoginPublicCta({ onOpen }: LoginPublicCtaProps) {
  return (
    <>
      <button
        onClick={onOpen}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md mb-4"
      >
        Buka Aplikasi Publik
        <ArrowRight size={18} />
      </button>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Fitur khusus member (pinjam buku, QR absensi) memerlukan akun tervalidasi.
      </p>
    </>
  );
}
