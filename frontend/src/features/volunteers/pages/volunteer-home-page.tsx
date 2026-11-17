'use client';

import { QrCode, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/button';
import { Card, SectionTitle, StatCard } from '@/components/ui/card';
import { EmptyState } from '../components/empty-state';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useAuth } from '@/features/auth';
import {
  VOLUNTEER_ASSIGNMENTS,
  VOLUNTEER_ATTENDANCE,
  VOLUNTEER_UPCOMING_ASSIGNMENTS,
} from '../fixtures/volunteer-dummy';
import { AttendanceHistoryList } from '../components/attendance-history-list';
import { DummyNotice } from '../components/dummy-notice';
import { UpcomingAssignmentCard } from '../components/upcoming-assignment-card';

export function VolunteerHomePage() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (!user) {
    return <p className="text-sm text-ink-soft">Memuat profil relawan…</p>;
  }

  const upcoming = VOLUNTEER_UPCOMING_ASSIGNMENTS.slice(0, 2);
  const approved = user.role === 'VOLUNTEER';

  return (
    <div className="space-y-8">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-ink">{user.name}</p>
            <p className="text-sm text-ink-soft">
              ID Relawan {user.memberCode} • {user.email}
            </p>
          </div>
        </div>
        <Badge tone={approved ? 'success' : 'warning'}>
          {approved ? 'Relawan disetujui' : 'Status relawan: menunggu'}
        </Badge>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Kegiatan mendatang"
          value={VOLUNTEER_UPCOMING_ASSIGNMENTS.length}
        />
        <StatCard label="Total penugasan" value={VOLUNTEER_ASSIGNMENTS.length} />
        <StatCard label="Total kehadiran" value={VOLUNTEER_ATTENDANCE.length} />
        <StatCard
          label="Notifikasi belum dibaca"
          value={unreadCount}
          hint="Status aplikasi, penugasan, pengingat"
        />
        <StatCard label="Status relawan" value={approved ? 'Disetujui' : 'Menunggu'} />
      </div>
      <DummyNotice />

      <section>
        <SectionTitle
          title="Tugas Mendatang"
          description="Dua penugasan terdekat dari volunteer_assignments."
        />
        {upcoming.length === 0 ? (
          <EmptyState
            title="Tidak ada penugasan mendatang"
            description="Penugasan baru ditetapkan admin/manajemen kegiatan."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((assignment) => (
              <UpcomingAssignmentCard
                key={assignment.id}
                assignment={assignment}
              />
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <LinkButton href="/volunteer/jadwal" variant="secondary" size="sm">
            Lihat Jadwal dan Tugas
          </LinkButton>
          <LinkButton href="/volunteer/kegiatan" variant="secondary" size="sm">
            Menu Kegiatan Saya
          </LinkButton>
          <LinkButton href="/volunteer/qr-absensi" variant="ghost" size="sm">
            <QrCode className="h-4 w-4" aria-hidden />
            QR Absensi
          </LinkButton>
        </div>
      </section>

      <section>
        <SectionTitle
          title="Riwayat Kehadiran"
          description="Catatan terakhir dari attendance_records."
        />
        {VOLUNTEER_ATTENDANCE.length === 0 ? (
          <EmptyState
            title="Belum ada catatan kehadiran"
            description="Kehadiran tercatat saat QR Absensi dipindai petugas."
          />
        ) : (
          <>
            <AttendanceHistoryList records={VOLUNTEER_ATTENDANCE} limit={3} />
            <div className="mt-3">
              <LinkButton href="/volunteer/kehadiran" variant="secondary" size="sm">
                Riwayat lengkap
              </LinkButton>
            </div>
          </>
        )}
      </section>

      <Card className="flex items-start gap-3 bg-surface-blue/50">
        <ScrollText
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-primary-deep">
            Panduan &amp; SOP Relawan
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Materi panduan/SOP resmi belum tersedia di aplikasi — dokumen resmi
            akan dipublikasikan admin ketika disiapkan. Kegiatan tetap mengikuti
            arahan koordinator pada setiap penugasan.
          </p>
        </div>
      </Card>
    </div>
  );
}
