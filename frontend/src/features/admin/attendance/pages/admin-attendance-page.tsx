'use client';

import { Button, LinkButton } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDateId } from '@/shared/lib/format';
import { useAdminAttendance } from '../hooks/use-admin-attendance';

export function AdminAttendancePage() {
  const { events, loading, error, reload } = useAdminAttendance();

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Absensi Kegiatan"
        description="Rekap kehadiran peserta per kegiatan; kelola check-in lewat halaman detail."
      />

      {error ? (
        <div className="flex items-center justify-between rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{error}</p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : events.length === 0 ? (
        <EmptyState title="Belum ada kegiatan berabsensi" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kegiatan</TH>
              <TH>Tanggal</TH>
              <TH>Hadir</TH>
              <TH>Terdaftar</TH>
              <TH>Kuota</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {events.map((event) => (
              <TR key={event.id}>
                <TD className="font-medium">{event.title}</TD>
                <TD>{formatDateId(event.eventDate)}</TD>
                <TD>{event.attendedCount}</TD>
                <TD>{event.registeredCount}</TD>
                <TD>{event.quota}</TD>
                <TD>
                  <LinkButton href={`/admin/absensi/${event.id}`} size="sm" variant="ghost">
                    Kelola
                  </LinkButton>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
