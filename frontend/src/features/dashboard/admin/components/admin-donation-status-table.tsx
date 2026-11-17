import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { DummyNotice } from '@/features/admin';
import { DUMMY_DONATIONS } from '@/features/admin';
import type { AdminBookDonationSnapshot } from '../types/admin.types';

interface AdminDonationStatusTableProps {
  bookDonations: AdminBookDonationSnapshot[];
  loading: boolean;
}

export function AdminDonationStatusTable({
  bookDonations,
  loading,
}: AdminDonationStatusTableProps) {
  const rows = [
    ...bookDonations.map((donation) => ({
      id: donation.id,
      reference: donation.batchCode,
      type: 'Buku',
      donor: donation.donorName,
      status: donation.status,
    })),
    ...DUMMY_DONATIONS.map((donation) => ({
      id: donation.id,
      reference: donation.reference,
      type: donation.type === 'financial' ? 'Uang' : 'Buku',
      donor: donation.donorName,
      status: donation.status,
    })),
  ].slice(0, 6);

  return (
    <section>
      <SectionTitle
        title="Status Donasi Terkini"
        description="Donasi buku dari backend; donasi finansial masih data contoh."
      />
      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : rows.length === 0 ? (
        <EmptyState title="Belum ada donasi" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Referensi</TH>
              <TH>Jenis</TH>
              <TH>Donatur</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((row) => (
              <TR key={row.id}>
                <TD className="font-medium">{row.reference}</TD>
                <TD>{row.type}</TD>
                <TD>{row.donor}</TD>
                <TD>
                  <Badge
                    tone={
                      row.status === 'ACCEPTED' || row.status === 'verified'
                        ? 'success'
                        : row.status === 'REJECTED' || row.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {row.status}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
      <div className="mt-2">
        <DummyNotice />
      </div>
    </section>
  );
}
