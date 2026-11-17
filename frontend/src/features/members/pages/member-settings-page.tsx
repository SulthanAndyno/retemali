'use client';

import { CreditCard, Hourglass, Info, Lock } from 'lucide-react';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth';
import { PasswordChangeForm } from '../components/password-change-form';

export function MemberSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-6">
      <SectionTitle
        title="Pengaturan Akun"
        description="Kelola kata sandi dan data akun Anda."
      />

      <Card>
        <h2 className="text-base font-bold text-ink">Ganti Kata Sandi</h2>
        <p className="mb-3 mt-0.5 text-xs text-ink-soft">
          Setiap perubahan kata sandi diverifikasi dari kata sandi saat ini.
        </p>
        <PasswordChangeForm />
      </Card>

      <Card className="space-y-2">
        <h2 className="text-base font-bold text-ink">Data Akun</h2>
        <dl className="space-y-1.5 text-sm text-ink-soft">
          <div className="flex items-start gap-2">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              ID Member:{' '}
              <span className="font-mono text-ink">{user?.memberCode ?? '-'}</span>
              {' • '}
              Status:{' '}
              {user?.status === 'ACTIVE'
                ? 'aktif'
                : 'menunggu verifikasi admin'}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              Email {user?.email ?? '-'} adalah identitas masuk dan tidak dapat
              diubah dari aplikasi — hubungi pengelola bila perlu.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Hourglass className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              Notifikasi pengingat tenggat dan status pembayaran mengikuti feed
              aktivitas akun Anda.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              Keluar akun tersedia di menu sisi/kotak menu atas — tidak berada
              di formulir ini.
            </div>
          </div>
        </dl>
      </Card>
    </div>
  );
}
