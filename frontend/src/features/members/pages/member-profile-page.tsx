'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth';
import { formatDateId } from '@/shared/lib/format';
import { MemberProfileForm } from '../components/member-profile-form';

export function MemberProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-sm text-ink-soft">Memuat profil member…</p>;
  }

  const active = user.status === 'ACTIVE';

  return (
    <div className="w-full space-y-6">
      <SectionTitle
        title="Profil Saya"
        description="Data diri member ReteMali; perubahan tersimpan langsung ke data profil."
      />

      <Card className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-40 flex-1">
          <p className="font-bold text-ink">{user.name}</p>
          <p className="text-sm text-ink-soft">
            {user.email} • {user.phone ?? '-'}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Badge tone="info">Member ReteMali · {user.memberCode}</Badge>
            <Badge tone={active ? 'success' : 'warning'}>
              {active ? 'Keanggotaan aktif' : 'Menunggu verifikasi admin'}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Member sejak {user.createdAt ? formatDateId(user.createdAt) : '-'}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-bold text-ink">Ubah Data Profil</h2>
        <p className="mb-3 mt-0.5 text-xs text-ink-soft">
          Nama &amp; nomor WhatsApp dipakai untuk administrasi peminjaman dan
          kegiatan.
        </p>
        <MemberProfileForm
          name={user.name}
          phone={user.phone ?? ''}
          email={user.email}
        />
      </Card>
    </div>
  );
}
