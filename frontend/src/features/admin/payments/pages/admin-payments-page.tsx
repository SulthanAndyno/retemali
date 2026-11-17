'use client';

import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import { DUMMY_PENDING_PAYMENTS } from '@/features/admin/fixtures/admin-dummy';
import { formatDateTimeId, formatRupiah } from '@/shared/lib/format';
import { useEventPaymentVerification } from '@/features/dashboard';
import { EventPaymentVerificationCard } from '@/features/dashboard';
import { PaymentProofModal } from '@/features/dashboard';

export function AdminPaymentsPage() {
  const { toast } = useToast();
  const payments = useEventPaymentVerification();

  const handleVerify = async (id: string, status: 'VERIFIED' | 'FAILED') => {
    const result = await payments.verify(id, { status });
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Verifikasi Pembayaran"
        description="Pembayaran kegiatan real; donasi finansial masih data contoh."
      />

      <EventPaymentVerificationCard
        registrations={payments.registrations}
        loading={payments.loading}
        error={payments.error}
        verifyingId={payments.verifyingId}
        onReload={() => void payments.reload()}
        onOpenProof={payments.openProof}
        onVerify={handleVerify}
      />

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
          {DUMMY_PENDING_PAYMENTS.map((payment) => (
            <TR key={payment.id}>
              <TD className="font-medium">{payment.description}</TD>
              <TD>{formatRupiah(payment.amount)}</TD>
              <TD>{payment.method === 'qris' ? 'QRIS' : 'Transfer Bank'}</TD>
              <TD>
                <Badge tone="warning">Menunggu</Badge>
              </TD>
              <TD>{formatDateTimeId(payment.createdAt)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <DummyNotice />

      <PaymentProofModal url={payments.proofPreview} onClose={payments.closeProof} />
    </div>
  );
}
