'use client';

import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import { DUMMY_QR_TOKENS } from '@/features/admin/fixtures/admin-dummy';
import { formatDateId, formatDateTimeId } from '@/shared/lib/format';
import { useAdminAttendance } from '../hooks/use-admin-attendance';

export function AdminAttendanceDetailPage({ eventId: provided }: { eventId?: string } = {}) {
  const params = useParams<{ kegiatanId?: string; id?: string }>();
  const eventId = provided ?? params?.kegiatanId ?? params?.id;
  const { events, loading, error } = useAdminAttendance(eventId);
  const event = events[0];
  const qr = DUMMY_QR_TOKENS[0];

  return (
    <div className="space-y-4">
      <SectionTitle
        title={event?.title ?? 'Detail Absensi'}
        description="Roster peserta real; token QR masih data contoh."
      />

      {loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : error ? (
        <p className="rounded-card border border-red-200 bg-red-50 p-3 text-sm text-danger">
          {error}
        </p>
      ) : event ? (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <p className="text-sm text-ink-soft">Hadir</p>
              <p className="text-2xl font-bold text-primary-deep">
                {event.attendedCount}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-soft">Terdaftar</p>
              <p className="text-2xl font-bold text-primary-deep">
                {event.registeredCount}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-soft">Tanggal</p>
              <p className="text-sm font-semibold text-ink">
                {formatDateId(event.eventDate)}
              </p>
            </Card>
          </div>

          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-primary-deep">Token QR</h3>
              <Badge tone="warning">Data contoh</Badge>
            </div>
            <p className="text-sm text-ink-soft">
              Token: <span className="font-mono">{qr.token}</span> • aktif{' '}
              {qr.active ? 'ya' : 'tidak'} • kedaluwarsa{' '}
              {formatDateTimeId(qr.expiresAt)}
            </p>
            <DummyNotice />
          </Card>

          <Table>
            <THead>
              <TR>
                <TH>Peserta</TH>
                <TH>Tiket</TH>
                <TH>Status</TH>
                <TH>Check-in</TH>
              </TR>
            </THead>
            <TBody>
              {(event.participants ?? []).map((participant) => (
                <TR key={participant.registrationId}>
                  <TD>
                    <p className="font-medium">{participant.user?.name ?? '-'}</p>
                    <p className="text-xs text-ink-soft font-mono">
                      {participant.user?.memberCode ?? '-'}
                    </p>
                  </TD>
                  <TD className="font-mono text-xs">{participant.ticketCode}</TD>
                  <TD>
                    <Badge
                      tone={
                        participant.status === 'CHECKED_IN'
                          ? 'success'
                          : participant.status === 'CANCELLED'
                            ? 'danger'
                            : 'info'
                      }
                    >
                      {participant.status}
                    </Badge>
                  </TD>
                  <TD>
                    {participant.checkedInAt
                      ? formatDateTimeId(participant.checkedInAt)
                      : '-'}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </>
      ) : (
        <p className="text-sm text-ink-soft">Kegiatan tidak ditemukan.</p>
      )}
    </div>
  );
}
