'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import { DUMMY_DONATIONS } from '@/features/admin/fixtures/admin-dummy';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import { useAdminDonations } from '../hooks/use-admin-donations';

export function AdminDonationsPage() {
  const { toast } = useToast();
  const { donations, loading, error, verifyingId, reload, verify } =
    useAdminDonations();

  const handleVerify = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    const message = await verify(id, status);
    toast(message, status === 'ACCEPTED' ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Manajemen Donasi"
        description="Kurasi donasi buku real; donasi finansial masih data contoh."
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
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Batch</TH>
              <TH>Donatur</TH>
              <TH>Paket</TH>
              <TH>Jumlah</TH>
              <TH>Status</TH>
              <TH>Tanggal</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {donations.map((donation) => (
              <TR key={donation.id}>
                <TD className="font-mono text-xs">{donation.batchCode}</TD>
                <TD>{donation.donorName}</TD>
                <TD>{donation.packageTitle}</TD>
                <TD>{donation.totalBooks}</TD>
                <TD>
                  <Badge
                    tone={
                      donation.status === 'ACCEPTED'
                        ? 'success'
                        : donation.status === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {donation.status}
                  </Badge>
                </TD>
                <TD>{formatDateId(donation.createdAt)}</TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={verifyingId === donation.id}
                      onClick={() => void handleVerify(donation.id, 'ACCEPTED')}
                    >
                      Terima
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={verifyingId === donation.id}
                      onClick={() => void handleVerify(donation.id, 'REJECTED')}
                    >
                      Tolak
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <SectionTitle
        title="Donasi Finansial"
        description="Data contoh sampai endpoint daftar donasi finansial tersedia."
      />
      <Table>
        <THead>
          <TR>
            <TH>Referensi</TH>
            <TH>Donatur</TH>
            <TH>Nominal</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {DUMMY_DONATIONS.filter((donation) => donation.type === 'financial').map(
            (donation) => (
              <TR key={donation.id}>
                <TD className="font-mono text-xs">{donation.reference}</TD>
                <TD>{donation.donorName}</TD>
                <TD>{formatRupiah(donation.amount ?? 0)}</TD>
                <TD>
                  <Badge tone="warning">{donation.status}</Badge>
                </TD>
              </TR>
            )
          )}
        </TBody>
      </Table>
      <DummyNotice />
    </div>
  );
}
