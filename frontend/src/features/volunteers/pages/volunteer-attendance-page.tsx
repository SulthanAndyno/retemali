import { History, QrCode } from 'lucide-react';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { formatDateId, formatDateTimeId } from '@/shared/lib/format';
import { VOLUNTEER_ATTENDANCE } from '../fixtures/volunteer-dummy';
import { DummyNotice } from '@/shared/components/ui/dummy-notice';

export function VolunteerAttendancePage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Riwayat Kehadiran"
        description="Rekap kehadiran relawan per kegiatan dari attendance_records."
      />
      <DummyNotice />

      {VOLUNTEER_ATTENDANCE.length === 0 ? (
        <EmptyState
          icon={<History aria-hidden />}
          title="Belum ada catatan kehadiran"
          description="Kehadiran tercatat ketika QR Absensi Anda dipindai petugas pada kegiatan."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kegiatan</TH>
              <TH>Waktu Scan</TH>
              <TH>Status Personel</TH>
            </TR>
          </THead>
          <TBody>
            {VOLUNTEER_ATTENDANCE.map((record) => (
              <TR key={record.id}>
                <TD>
                  {record.title}
                  <span className="block text-xs text-ink-soft">
                    {formatDateId(record.scannedAt)}
                  </span>
                </TD>
                <TD>
                  {formatDateTimeId(record.scannedAt)}
                  <span className="block font-mono text-xs text-ink-soft">
                    {record.scannedAt}
                  </span>
                </TD>
                <TD className="capitalize">{record.personRole}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Card className="flex items-start gap-3 bg-surface-blue/50">
        <QrCode
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">
          Pencatatan kehadiran otomatis akan tersedia setelah fitur absensi
          diaktifkan. Saat ini catatan kehadiran berasal dari proses yang sudah
          berjalan.
        </p>
      </Card>
    </div>
  );
}
