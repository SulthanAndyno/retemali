import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button, LinkButton } from '@/shared/components/ui/button';

export function RegisterSuccessCard({
  code,
  onContinue,
}: {
  code: string;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-4">
      <div
        role="status"
        className="flex items-start gap-3 rounded-field border border-success/30 bg-green-50 p-4"
      >
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-success"
          aria-hidden
        />
        <div className="space-y-1 text-sm">
          <p className="font-bold text-success">
            Pendaftaran Berhasil Dikirim!
          </p>
          <p className="text-ink">
            Nomor anggota Anda:{' '}
            <span className="font-mono font-bold text-ink">{code}</span>
          </p>
          <p className="text-ink-soft">
            Akun member masih menunggu verifikasi keanggotaan oleh admin —
            fitur peminjaman buku aktif setelah verifikasi. Anda dapat
            masuk kapan saja dengan email dan kata sandi yang didaftarkan.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" className="w-full" onClick={onContinue}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Masuk di sini
        </Button>
        <LinkButton href="/" className="w-full">
          Jelajahi aplikasi publik
        </LinkButton>
      </div>
      <p className="text-center text-xs text-ink-soft">
        Simpan nomor anggota Anda. Butuh bantuan? Hubungi pengelola melalui
        halaman kontak.
      </p>
      <Link
        href="/login"
        className="block text-center text-xs font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        Kembali ke halaman masuk
      </Link>
    </div>
  );
}
