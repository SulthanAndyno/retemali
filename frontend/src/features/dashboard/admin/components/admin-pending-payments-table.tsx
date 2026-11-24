import { Badge } from '@/shared/components/ui/badge';
import { SectionTitle } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDateTimeId, formatRupiah } from '@/shared/lib/format';
import type {
  AdminFinancialDonationSnapshot,
  AdminRegistrationSnapshot,
} from '../types/admin.types';

interface AdminPendingPaymentsTableProps {
  rows: AdminRegistrationSnapshot[];
  financialRows?: AdminFinancialDonationSnapshot[];
  loading: boolean;
}

interface PaymentRow {
  id: string;
  label: string;
  amount: number;
  method: string;
  createdAt: string;
}

export function AdminPendingPaymentsTable({
  rows,
  financialRows = [],
  loading,
}: AdminPendingPaymentsTableProps) {
  const registrationRows: PaymentRow[] = rows.map((row) => ({
    id: `reg-${row.id}`,
    label: `${row.user.name} • ${row.event.title}`,
    amount: Number(row.event.ticketPrice ?? 0),
    method: 'Tiket Kegiatan',
    createdAt: row.createdAt,
  }));

  const donationRows: PaymentRow[] = financialRows.map((donation) => ({
    id: `don-${donation.id}`,
    label: `${donation.donorName} • ${donation.purposeLabel || donation.receiptCode}`,
    amount: Number(donation.amount ?? 0),
    method: donation.paymentMethod === 'QRIS' ? 'QRIS' : 'Transfer Bank',
    createdAt: donation.createdAt,
  }));

  const payments = [...registrationRows, ...donationRows]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <section>
      <SectionTitle
        title="Pembayaran Menunggu Verifikasi"
        description="Status pendaftar/donatur tetap menunggu sampai admin memverifikasi."
      />
      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : payments.length === 0 ? (
        <EmptyState title="Tidak ada pembayaran tertunda" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Subjek</TH>
              <TH>Jumlah</TH>
              <TH>Metode</TH>
              <TH>Status</TH>
              <TH>Masuk</TH>
            </TR>
          </THead>
          <TBody>
            {payments.map((payment) => (
              <TR key={payment.id}>
                <TD className="font-medium">{payment.label}</TD>
                <TD>{formatRupiah(payment.amount)}</TD>
                <TD>{payment.method}</TD>
                <TD>
                  <Badge tone="warning">Menunggu</Badge>
                </TD>
                <TD>{formatDateTimeId(payment.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </section>
  );
}
