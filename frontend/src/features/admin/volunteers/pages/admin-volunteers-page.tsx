'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/toast';
import { formatDateId } from '@/shared/lib/format';
import { useAdminVolunteers } from '../hooks/use-admin-volunteers';

export function AdminVolunteersPage() {
  const { toast } = useToast();
  const { applications, loading, error, pendingId, reload, review } =
    useAdminVolunteers();

  const handleApprove = async (id: string) => {
    const message = await review(id, 'APPROVED');
    toast(message, 'success');
  };

  const handleReject = async (id: string) => {
    const note = window.prompt('Alasan penolakan (opsional):') ?? undefined;
    const message = await review(id, 'REJECTED', note);
    toast(message, 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Manajemen Volunteer"
        description="Pendaftaran relawan dan status persetujuannya."
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
      ) : applications.length === 0 ? (
        <EmptyState title="Belum ada pendaftaran relawan" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nama</TH>
              <TH>Email</TH>
              <TH>Divisi</TH>
              <TH>Status</TH>
              <TH>Tanggal</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {applications.map((application) => (
              <TR key={application.id}>
                <TD className="font-medium">{application.user.name}</TD>
                <TD>{application.user.email}</TD>
                <TD>{application.division}</TD>
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
                    {application.status}
                  </Badge>
                </TD>
                <TD>{formatDateId(application.createdAt)}</TD>
                <TD>
                  {application.status === 'PENDING' ? (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="success"
                        disabled={pendingId === application.id}
                        onClick={() => void handleApprove(application.id)}
                      >
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={pendingId === application.id}
                        onClick={() => void handleReject(application.id)}
                      >
                        Tolak
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-soft">-</span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
