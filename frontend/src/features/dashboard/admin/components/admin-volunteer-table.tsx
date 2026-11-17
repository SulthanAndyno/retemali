import { Badge } from '@/shared/components/ui/badge';
import { LinkButton } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import type { AdminVolunteerApplicationSnapshot } from '../types/admin.types';

interface AdminVolunteerTableProps {
  applications: AdminVolunteerApplicationSnapshot[];
  loading: boolean;
}

export function AdminVolunteerTable({
  applications,
  loading,
}: AdminVolunteerTableProps) {
  return (
    <section>
      <SectionTitle
        title="Persetujuan Relawan Terbaru"
        description="Daftar berkas relawan dan status persetujuannya."
      />
      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nama</TH>
              <TH>Email</TH>
              <TH>Status</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {applications.slice(0, 5).map((application) => (
              <TR key={application.id}>
                <TD className="font-medium">{application.user.name}</TD>
                <TD>{application.user.email}</TD>
                <TD>
                  <Badge
                    tone={
                      application.status === 'APPROVED'
                        ? 'success'
                        : application.status === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {application.status === 'APPROVED'
                      ? 'Disetujui'
                      : application.status === 'REJECTED'
                        ? 'Ditolak'
                        : 'Menunggu'}
                  </Badge>
                </TD>
                <TD>
                  <LinkButton href="/admin/volunteer" size="sm" variant="ghost">
                    Kelola
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
