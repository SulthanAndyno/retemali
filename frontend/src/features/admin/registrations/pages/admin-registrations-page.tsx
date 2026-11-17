'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import EmptyState from '@/components/ui/EmptyState';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import { formatDateId, formatRupiah } from '@/shared/lib/format';
import { useAdminRegistrations } from '../hooks/use-admin-registrations';

export function AdminRegistrationsPage() {
  const list = useAdminRegistrations();

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Pendaftaran Kegiatan"
        description="Seluruh pendaftar kegiatan dan status pembayarannya."
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Kegiatan
          <select
            value={list.eventId}
            onChange={(event) => list.setEventId(event.target.value)}
            className="mt-1.5 w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Semua kegiatan</option>
            {list.eventOptions.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink">
          Status pembayaran
          <select
            value={list.paymentStatus}
            onChange={(event) => list.setPaymentStatus(event.target.value)}
            className="mt-1.5 w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Semua</option>
            <option value="PENDING">Menunggu</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="FAILED">Gagal</option>
          </select>
        </label>
      </div>

      {list.error ? (
        <div className="flex items-center justify-between rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{list.error}</p>
          <Button size="sm" variant="danger" onClick={() => void list.reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : list.loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : list.rows.length === 0 ? (
        <EmptyState title="Belum ada pendaftaran" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kegiatan</TH>
              <TH>Peserta</TH>
              <TH>Tiket</TH>
              <TH>Bayar</TH>
              <TH>Status</TH>
              <TH>Tanggal</TH>
            </TR>
          </THead>
          <TBody>
            {list.rows.map((row) => (
              <TR key={row.id}>
                <TD className="font-medium">{row.event.title}</TD>
                <TD>
                  <p>{row.user.name}</p>
                  <p className="text-xs text-ink-soft">{row.user.memberCode}</p>
                </TD>
                <TD className="font-mono text-xs">{row.ticketCode}</TD>
                <TD>{formatRupiah(Number(row.event.infaqAmount ?? 0))}</TD>
                <TD>
                  <Badge
                    tone={
                      row.paymentStatus === 'VERIFIED'
                        ? 'success'
                        : row.paymentStatus === 'FAILED'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {row.paymentStatus ?? 'GRATIS'}
                  </Badge>
                </TD>
                <TD>{formatDateId(row.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {list.meta && list.meta.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="secondary"
            disabled={!list.meta.hasPrevPage || list.loading}
            onClick={() => list.setPage(Math.max(1, list.page - 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-xs text-ink-soft">
            Hal. {list.meta.page} / {list.meta.totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={!list.meta.hasNextPage || list.loading}
            onClick={() => list.setPage(list.page + 1)}
          >
            Berikutnya
          </Button>
        </div>
      ) : null}

      <DummyNotice />
    </div>
  );
}
