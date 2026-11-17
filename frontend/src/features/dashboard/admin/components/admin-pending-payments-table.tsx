import { Badge } from '@/shared/components/ui/badge';
import { SectionTitle } from '@/shared/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { DummyNotice } from '@/shared/components/ui/dummy-notice';
import { DUMMY_PENDING_PAYMENTS } from '@/features/admin';
import { formatDateTimeId, formatRupiah } from '@/shared/lib/format';
import type { AdminRegistrationSnapshot } from '../types/admin.types';

interface AdminPendingPaymentsTableProps {
  rows: AdminRegistrationSnapshot[];
  loading: boolean;
}

interface PaymentRow {
  id: string;
  label: string;
  amount: number;
  method: string;
  createdAt: string;
  dummy: boolean;
}

export function AdminPendingPaymentsTable({
  rows,
  loading,
}: AdminPendingPaymentsTableProps) {
  const realRows: PaymentRow[] = rows.map((row) => ({
    id: row.id,
    label: `${row.user.name} • ${row.event.title}`,
    amount: Number(row.event.infaqAmount ?? 0),
    method: '-',
    createdAt: row.createdAt,
    dummy: false,
  }));

  const dummyRows: PaymentRow[] = DUMMY_PENDING_PAYMENTS.filter(
    (payment) => payment.status === 'pending'
  ).map((payment) => ({
    id: payment.id,
    label: payment.description,
    amount: payment.amount,
    method: payment.method === 'qris' ? 'QRIS' : 'Transfer Bank',
    createdAt: payment.createdAt,
    dummy: true,
  }));

  const payments = [...realRows, ...dummyRows].slice(0, 5);

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
      <div className="mt-2">
        <DummyNotice />
      </div>
    </section>
  );
}
