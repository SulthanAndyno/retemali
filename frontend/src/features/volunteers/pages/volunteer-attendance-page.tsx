'use client';

import { ClipboardCheck, History } from 'lucide-react';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { formatDateId, formatDateTimeId } from '@/shared/lib/format';
import { useVolunteerPortalData } from '../hooks/use-volunteer-portal-data';

export function VolunteerAttendancePage() {
  const { attendance, loading } = useVolunteerPortalData();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Riwayat Kehadiran"
        description="Rekap kehadiran volunteer dari log shift dan kegiatan operasional."
      />

      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : attendance.length === 0 ? (
        <EmptyState
          icon={<History aria-hidden />}
          title="Belum ada catatan kehadiran"
          description="Kehadiran tercatat ketika shift piket atau E-Tiket Anda diverifikasi pada kegiatan."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kegiatan / Shift</TH>
              <TH>Waktu Check-in</TH>
              <TH>Status Personel</TH>
            </TR>
          </THead>
          <TBody>
            {attendance.map((record) => (
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
        <ClipboardCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">
          Catatan kehadiran terhubung langsung dengan log shift piket volunteer
          dan presensi kegiatan ReteMali.
        </p>
      </Card>
    </div>
  );
}
