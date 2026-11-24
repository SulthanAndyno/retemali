'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { useToast } from '@/shared/components/ui/toast';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import { useAdminDonations } from '../hooks/use-admin-donations';

export function AdminDonationsPage() {
  const { toast } = useToast();
  const {
    donations,
    financialDonations,
    loading,
    error,
    verifyingId,
    reload,
    verify,
    verifyFinancial,
  } = useAdminDonations();

  const handleVerify = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    const message = await verify(id, status);
    toast(message, status === 'ACCEPTED' ? 'success' : 'error');
  };

  const handleVerifyFinancial = async (
    id: string,
    status: 'VERIFIED' | 'FAILED'
  ) => {
    const message = await verifyFinancial(id, status);
    toast(message, status === 'VERIFIED' ? 'success' : 'error');
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Manajemen Donasi Buku Fisik"
        description="Kurasi dan verifikasi penyerahan paket donasi buku fisik."
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
      ) : donations.length === 0 ? (
        <EmptyState title="Belum ada donasi buku fisik" />
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
        description="Daftar transaksi donasi finansial (QRIS & Transfer Bank) beserta status verifikasinya."
      />
      {loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : financialDonations.length === 0 ? (
        <EmptyState title="Belum ada transaksi donasi finansial" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Referensi</TH>
              <TH>Donatur</TH>
              <TH>Peruntukan</TH>
              <TH>Metode</TH>
              <TH>Nominal</TH>
              <TH>Status</TH>
              <TH>Tanggal</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {financialDonations.map((donation) => (
              <TR key={donation.id}>
                <TD className="font-mono text-xs">{donation.receiptCode}</TD>
                <TD>{donation.donorName}</TD>
                <TD>{donation.purposeLabel}</TD>
                <TD>{donation.paymentMethod}</TD>
                <TD>{formatRupiah(Number(donation.amount ?? 0))}</TD>
                <TD>
                  <Badge
                    tone={
                      donation.paymentStatus === 'VERIFIED'
                        ? 'success'
                        : donation.paymentStatus === 'FAILED'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {donation.paymentStatus}
                  </Badge>
                </TD>
                <TD>{formatDateId(donation.createdAt)}</TD>
                <TD>
                  {donation.paymentStatus === 'PENDING' ? (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="success"
                        disabled={verifyingId === donation.id}
                        onClick={() =>
                          void handleVerifyFinancial(donation.id, 'VERIFIED')
                        }
                      >
                        Verifikasi
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={verifyingId === donation.id}
                        onClick={() =>
                          void handleVerifyFinancial(donation.id, 'FAILED')
                        }
                      >
                        Tolak
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-soft">Selesai</span>
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
