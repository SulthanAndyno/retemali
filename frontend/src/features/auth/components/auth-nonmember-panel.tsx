import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PUBLIC_BENEFITS } from '../lib/auth-options';

export function AuthNonMemberPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Sebagai pengunjung publik tanpa akun, Anda dapat:
      </p>
      <ul className="space-y-2 text-sm text-ink" aria-label="Fitur non-member">
        {PUBLIC_BENEFITS.map((benefit) => (
          <li
            key={benefit}
            className="rounded-field bg-white px-3 py-2 shadow-card"
          >
            {benefit}
          </li>
        ))}
      </ul>
      <Button className="w-full" onClick={onOpen}>
        Buka Aplikasi Publik
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <p className="text-center text-xs text-ink-soft">
        Fitur khusus member (pinjam buku, QR absensi) memerlukan akun
        tervalidasi.
      </p>
    </div>
  );
}
