'use client';

import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, SectionTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { VOLUNTEER_ASSIGNMENTS } from '../fixtures/volunteer-dummy';
import { DummyNotice } from '../components/dummy-notice';
import { VolunteerProfileForm } from '../components/volunteer-profile-form';

export function VolunteerProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-sm text-ink-soft">Memuat profil relawan…</p>;
  }

  const approved = user.role === 'VOLUNTEER';
  const approvedAssignments = VOLUNTEER_ASSIGNMENTS.filter(
    (assignment) => assignment.approval === 'approved'
  ).length;

  return (
    <div className="w-full space-y-6">
      <SectionTitle
        title="Profil Saya (Relawan)"
        description="Data relawan dan status persetujuan; menu fitur relawan aktif untuk akun disetujui."
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
            <Badge tone="info">Relawan · {user.memberCode}</Badge>
            <Badge tone={approved ? 'success' : 'warning'}>
              {approved ? 'Disetujui admin' : 'Status: menunggu'}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden />
            Total penugasan aktif: {approvedAssignments} dari{' '}
            {VOLUNTEER_ASSIGNMENTS.length} penugasan tercatat
          </p>
        </div>
      </Card>
      <DummyNotice />

      <Card>
        <h2 className="text-base font-bold text-ink">Ubah Data Profil</h2>
        <p className="mb-3 mt-0.5 text-xs text-ink-soft">
          Nama &amp; nomor WhatsApp dipakai koordinator untuk menghubungi Anda
          saat penugasan.
        </p>
        <VolunteerProfileForm
          name={user.name}
          phone={user.phone ?? ''}
          email={user.email}
        />
      </Card>
    </div>
  );
}
