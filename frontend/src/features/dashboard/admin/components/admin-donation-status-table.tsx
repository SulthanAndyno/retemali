import { Badge } from '@/shared/components/ui/badge';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import type {
  AdminBookDonationSnapshot,
  AdminFinancialDonationSnapshot,
} from '../types/admin.types';

interface AdminDonationStatusTableProps {
  bookDonations: AdminBookDonationSnapshot[];
  financialDonations?: AdminFinancialDonationSnapshot[];
  loading: boolean;
}

export function AdminDonationStatusTable({
  bookDonations,
  financialDonations = [],
  loading,
}: AdminDonationStatusTableProps) {
  const rows = [
    ...bookDonations.map((donation) => ({
      id: `book-${donation.id}`,
      reference: donation.batchCode,
      type: 'Buku',
      donor: donation.donorName,
      status: donation.status,
      createdAt: donation.createdAt,
    })),
    ...financialDonations.map((donation) => ({
      id: `fin-${donation.id}`,
      reference: donation.receiptCode,
      type: 'Uang',
      donor: donation.donorName,
      status: donation.paymentStatus,
      createdAt: donation.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <section>
      <SectionTitle
        title="Status Donasi Terkini"
        description="Donasi buku fisik dan donasi finansial terbaru dari backend."
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
                      row.status === 'ACCEPTED' || row.status === 'VERIFIED'
                        ? 'success'
                        : row.status === 'REJECTED' || row.status === 'FAILED'
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
    </section>
  );
}
