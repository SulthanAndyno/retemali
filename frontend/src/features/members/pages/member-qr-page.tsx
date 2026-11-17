'use client';

import { QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useNotifications } from '@/contexts/NotificationsContext';
import { formatDateId, formatDateTimeId } from '@/shared/lib/format';
import { useMemberTickets } from '../hooks/use-member-tickets';
import { useNow } from '../hooks/use-now';
import {
  MEMBER_ATTENDANCE,
  MEMBER_QR_TOKENS,
} from '../fixtures/member-dummy';
import { DummyNotice } from '../components/dummy-notice';
import { EmptyState } from '../components/empty-state';

export function MemberQrPage() {
  const { tickets, loading } = useMemberTickets();
  const { items } = useNotifications();
  const now = useNow();
  const token = MEMBER_QR_TOKENS[0];
  const reminders = items.slice(0, 3);

  const upcoming = tickets
    .filter(
      (ticket) =>
        ticket.status === 'REGISTERED' &&
        new Date(ticket.event.eventDate).getTime() + 24 * 60 * 60 * 1000 >=
          (now ?? 0)
    )
    .sort((a, b) => a.event.eventDate.localeCompare(b.event.eventDate));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="QR Absensi"
        description="Check-in kegiatan melalui QR yang ditampilkan petugas; validasi dan keunikan menjadi tanggung jawab server."
      />

      <Card className="flex items-start gap-3 bg-surface-blue/50">
        <QrCode
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">
          Cara check-in: buka QR absensi kegiatan yang ditampilkan petugas, lalu
          tekan tombol check-in. Check-in divalidasi server, tercatat satu kali
          per kegiatan, dan hanya untuk peserta yang terdaftar.
        </p>
      </Card>

      <DummyNotice />

      <section>
        <SectionTitle
          title="Kegiatan Mendatang yang Anda Daftarkan"
          description="Halaman check-in terbuka setelah petugas membuat QR aktif."
        />
        {loading ? (
          <div className="h-40 animate-pulse rounded-card bg-white" />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={<QrCode aria-hidden />}
            title="Belum ada kegiatan mendatang terdaftar"
            description="Daftar kegiatan komunitas terlebih dahulu melalui menu Kegiatan."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((ticket) => (
              <Card key={ticket.id} className="space-y-2">
                <p className="font-bold text-ink">{ticket.event.title}</p>
                <p className="text-xs text-ink-soft">
                  {formatDateId(ticket.event.eventDate)} •{' '}
                  {ticket.event.location}
                </p>
                <p className="text-xs text-ink-soft">
                  {ticket.event.startTime}–{ticket.event.endTime} WIB
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="info">Absensi belum dibuka</Badge>
                  {token?.active ? (
                    <LinkButton href="/member/qr-absensi" size="sm">
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
            title="Pengingat Kegiatan"
            description="Notifikasi aktivitas terbaru untuk member."
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
                    {item.kind === 'EVENT_CLOSED'
                      ? 'Kegiatan ditutup'
                      : 'Pengingat'}
                  </Badge>
                  <p className="mt-1 text-sm font-bold text-ink">{item.title}</p>
                  <p className="text-xs text-ink-soft">{item.description}</p>
                </div>
                <LinkButton
                  href="/member/kegiatan"
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
          title="Riwayat Kehadiran"
          description="Catatan check-in Anda per kegiatan."
        />
        {MEMBER_ATTENDANCE.length === 0 ? (
          <EmptyState
            title="Belum ada kehadiran tercatat"
            description="Check-in melalui QR akan tercatat di sini."
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
              {MEMBER_ATTENDANCE.map((record) => (
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
        <LinkButton href="/member/kegiatan" variant="secondary" size="sm">
          Kegiatan Saya
        </LinkButton>
        <LinkButton href="/member/notifikasi" variant="ghost" size="sm">
          Notifikasi Saya
        </LinkButton>
      </div>
    </div>
  );
}
