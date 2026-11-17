import { LinkButton } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import type { AdminAttendanceSnapshot } from '../types/admin.types';

interface AdminAttendanceTableProps {
  rows: AdminAttendanceSnapshot[];
  loading: boolean;
}

export function AdminAttendanceTable({ rows, loading }: AdminAttendanceTableProps) {
  return (
    <section>
      <SectionTitle
        title="Absensi Kegiatan"
        description="Peserta hadir melalui check-in tiket; kelola QR menyusul."
      />
      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : rows.length === 0 ? (
        <EmptyState title="Belum ada kegiatan berabsensi" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kegiatan</TH>
              <TH>Hadir</TH>
              <TH>Terdaftar</TH>
              <TH>Kelola</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((row) => (
              <TR key={row.id}>
                <TD className="font-medium">{row.title}</TD>
                <TD>{row.attendedCount}</TD>
                <TD>{row.registeredCount}</TD>
                <TD>
                  <LinkButton href={`/admin/absensi/${row.id}`} size="sm" variant="ghost">
                    Lihat
                  </LinkButton>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </section>
  );
}
