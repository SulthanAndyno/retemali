'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { useToast } from '@/shared/components/ui/toast';
import { formatDateTimeId, formatRupiah } from '@/shared/lib/format';
import {
  EventPaymentVerificationCard,
  PaymentProofModal,
  useEventPaymentVerification,
} from '@/features/dashboard';
import {
  getFinancialDonations,
  verifyFinancialDonation,
} from '../../donations/api/admin-donations.api';
import type { AdminFinancialDonation } from '../../donations/types/admin-donations.types';

export function AdminPaymentsPage() {
  const { toast } = useToast();
  const payments = useEventPaymentVerification();
  const [financialPending, setFinancialPending] = useState<
    AdminFinancialDonation[]
  >([]);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [verifyingFinId, setVerifyingFinId] = useState<string | null>(null);

  const loadFinancial = useCallback(async () => {
    setLoadingFinancial(true);
    try {
      const res = await getFinancialDonations('PENDING');
      setFinancialPending(res.data ?? []);
    } catch {
      setFinancialPending([]);
    } finally {
      setLoadingFinancial(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFinancial();
  }, [loadFinancial]);

  const handleVerify = async (id: string, status: 'VERIFIED' | 'FAILED') => {
    const result = await payments.verify(id, { status });
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handleVerifyFinancial = async (
    id: string,
    status: 'VERIFIED' | 'FAILED'
  ) => {
    setVerifyingFinId(id);
    try {
      await verifyFinancialDonation(id, status);
      await loadFinancial();
      toast(
        status === 'VERIFIED'
          ? 'Pembayaran donasi finansial diverifikasi.'
          : 'Pembayaran donasi finansial ditolak.',
        status === 'VERIFIED' ? 'success' : 'error'
      );
    } catch {
      toast('Gagal memperbarui status pembayaran donasi.', 'error');
    } finally {
      setVerifyingFinId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Verifikasi Pembayaran"
        description="Verifikasi pembayaran tiket kegiatan berbayar dan transfer donasi finansial."
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

      <SectionTitle
        title="Donasi Finansial Menunggu Verifikasi"
        description="Transaksi donasi transfer bank yang menunggu konfirmasi admin."
      />
      {loadingFinancial ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : financialPending.length === 0 ? (
        <EmptyState title="Tidak ada donasi finansial yang menunggu verifikasi" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Referensi</TH>
              <TH>Donatur & Peruntukan</TH>
              <TH>Jumlah</TH>
              <TH>Metode</TH>
              <TH>Status</TH>
              <TH>Masuk</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {financialPending.map((payment) => (
              <TR key={payment.id}>
                <TD className="font-mono text-xs">{payment.receiptCode}</TD>
                <TD className="font-medium">
                  {payment.donorName} • {payment.purposeLabel}
                </TD>
                <TD>{formatRupiah(Number(payment.amount ?? 0))}</TD>
                <TD>{payment.paymentMethod}</TD>
                <TD>
                  <Badge tone="warning">Menunggu</Badge>
                </TD>
                <TD>{formatDateTimeId(payment.createdAt)}</TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={verifyingFinId === payment.id}
                      onClick={() =>
                        void handleVerifyFinancial(payment.id, 'VERIFIED')
                      }
                    >
                      Terima
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={verifyingFinId === payment.id}
                      onClick={() =>
                        void handleVerifyFinancial(payment.id, 'FAILED')
                      }
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

      <PaymentProofModal
        url={payments.proofPreview}
        onClose={payments.closeProof}
      />
    </div>
  );
}
