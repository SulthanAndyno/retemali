'use client';

import { QrCode, ScanLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { EmptyState } from '../components/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useNotifications } from '@/contexts/NotificationsContext';
import { formatDateId, formatDateTimeId } from '@/shared/lib/format';
import {
  VOLUNTEER_ATTENDANCE,
  VOLUNTEER_QR_TOKENS,
  VOLUNTEER_UPCOMING_ASSIGNMENTS,
} from '../fixtures/volunteer-dummy';
import { DummyNotice } from '../components/dummy-notice';

export function VolunteerQrPage() {
  const { items } = useNotifications();
  const token = VOLUNTEER_QR_TOKENS[0];
  const reminders = items.slice(0, 3);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="QR Absensi Relawan"
        description="Check-in penugasan Anda melalui QR kegiatan; kehadiran relawan dicatat sesuai penugasan."
      />

      <Card className="flex items-start gap-3 bg-surface-blue/50">
        <ScanLine
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">
          Check-in hanya berlaku untuk penugasan yang sudah disetujui pada
          kegiatan terpublikasi, dan hanya saat jendela absensi terbuka.
        </p>
      </Card>

      <DummyNotice />

      <section>
        <SectionTitle
          title="Penugasan Mendatang"
          description="Halaman check-in tersedia setelah petugas menyiapkan QR kegiatan."
        />
        {VOLUNTEER_UPCOMING_ASSIGNMENTS.length === 0 ? (
          <EmptyState
            icon={<QrCode aria-hidden />}
            title="Belum ada penugasan mendatang"
            description="Penugasan relawan yang disetujui akan tampil di sini."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {VOLUNTEER_UPCOMING_ASSIGNMENTS.map((assignment) => (
              <Card key={assignment.id} className="space-y-2">
                <p className="font-bold text-ink">{assignment.title}</p>
                <p className="text-xs text-ink-soft">
                  {formatDateId(assignment.eventDate)} • {assignment.location}
                </p>
                <p className="text-xs text-ink-soft">
                  {assignment.startTime}–{assignment.endTime} WIB
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="info">Absensi belum dibuka</Badge>
                  {token?.active ? (
                    <LinkButton href="/volunteer/operasional" size="sm">
                      Buka Halaman Check-in
                    </LinkButton>
                  ) : (
                    <Badge tone="neutral">QR belum dibuat petugas</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {reminders.length > 0 ? (
        <section>
          <SectionTitle
            title="Pengingat Penugasan"
            description="Notifikasi aktivitas terbaru untuk relawan."
          />
          <div className="space-y-2">
            {reminders.map((item) => (
              <Card
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <Badge
                    tone={
                      item.severity === 'success'
                        ? 'success'
                        : item.severity === 'warning'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {item.kind === 'EVENT_CLOSED' ? 'Kegiatan ditutup' : 'Pengingat'}
                  </Badge>
                  <p className="mt-1 text-sm font-bold text-ink">{item.title}</p>
                  <p className="text-xs text-ink-soft">{item.description}</p>
                </div>
                <LinkButton
                  href="/volunteer/jadwal"
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                >
                  Lihat Jadwal
                </LinkButton>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionTitle
          title="Riwayat Kehadiran Relawan"
          description="Catatan check-in Anda selama bertugas."
        />
        {VOLUNTEER_ATTENDANCE.length === 0 ? (
          <EmptyState
            title="Belum ada kehadiran tercatat"
            description="Check-in penugasan melalui QR akan tercatat di sini."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Kegiatan</TH>
                <TH>Waktu Check-in</TH>
              </TR>
            </THead>
            <TBody>
              {VOLUNTEER_ATTENDANCE.map((record) => (
                <TR key={record.id}>
                  <TD className="font-medium">{record.title}</TD>
                  <TD>{formatDateTimeId(record.scannedAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/volunteer/jadwal" variant="secondary" size="sm">
          Jadwal Tugas Saya
        </LinkButton>
        <LinkButton href="/volunteer/notifikasi" variant="ghost" size="sm">
          Notifikasi Saya
        </LinkButton>
      </div>
    </div>
  );
}
