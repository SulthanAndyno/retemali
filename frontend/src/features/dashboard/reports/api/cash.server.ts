import 'server-only';
import type { NextRequest } from 'next/server';
import { endOfDayIso, upstreamRequest } from '@/shared/lib/server-upstream';
import { buildXlsx, type XlsxCellValue } from '@/shared/lib/xlsx';
import { buildCashReport } from '../lib/cash-report';
import { formatDateId, formatDateTimeId } from '../lib/report-format';
import type {
  CashFilters,
  CashReport,
  UpstreamCashReport,
} from '../types/report.types';

export function readCashFilters(request: NextRequest): CashFilters {
  const { searchParams } = new URL(request.url);
  return {
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
  };
}

export type LoadCashResult =
  | { ok: true; data: CashReport }
  | { ok: false; status: number; error: string };

export async function loadCashReport(
  token: string,
  filters: CashFilters
): Promise<LoadCashResult> {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  const endOfDay = endOfDayIso(filters.to || null);
  if (endOfDay) params.set('to', endOfDay);

  const query = params.toString();
  const upstream = await upstreamRequest<{ data: UpstreamCashReport }>(
    `/donations/cash-report${query ? `?${query}` : ''}`,
    { token }
  );

  if (!upstream.ok || !upstream.data?.data) {
    return {
      ok: false,
      status: upstream.status || 502,
      error: upstream.error ?? 'Gagal memuat laporan kas.',
    };
  }

  return {
    ok: true,
    data: buildCashReport(upstream.data.data, filters, new Date().toISOString()),
  };
}

export function buildCashWorkbook(report: CashReport): Buffer {
  const infoRows: XlsxCellValue[][] = [
    ['LAPORAN KAS — TAMAN BACA RETE MALI'],
    ['RT 05 / RW 14 Jatirangga'],
    [],
    ['Dibuat pada', formatDateTimeId(report.generatedAt)],
    [
      'Periode laporan',
      `${formatDateId(report.period.from)} s.d. ${formatDateId(report.period.to)}`,
    ],
    [],
    ['RINGKASAN', ''],
    ['Total arus kas masuk', report.summary.totalIncome],
    ['Total pengeluaran', report.summary.totalExpense],
    ['Arus kas bersih', report.summary.netCashFlow],
    ['Donasi finansial terverifikasi', report.summary.donationIncome],
    ['Tiket masuk kegiatan', report.summary.eventTicketIncome],
    ['Denda sirkulasi', report.summary.fineIncome],
    ['Jumlah transaksi', report.summary.transactionCount],
    [],
    ['CATATAN', report.expenseTracking.reason],
  ];

  const summaryRows: XlsxCellValue[][] = [
    ['Kategori', 'Jumlah Transaksi', 'Nominal (Rp)'],
    ...report.byCategory.map((row) => [row.label, row.count, row.amount]),
    ['TOTAL', report.summary.transactionCount, report.summary.totalIncome],
  ];

  const methodRows: XlsxCellValue[][] = [
    ['Metode Pembayaran', 'Jumlah Transaksi', 'Nominal (Rp)'],
    ...report.byMethod.map((row) => [row.method, row.count, row.amount]),
  ];

  const monthRows: XlsxCellValue[][] = [
    ['Bulan', 'Arus Kas Masuk (Rp)'],
    ...report.byMonth.map((row) => [row.label, row.income]),
  ];

  const entryRows: XlsxCellValue[][] = [
    [
      'No',
      'Tanggal',
      'Kategori',
      'Keterangan',
      'Metode',
      'Referensi',
      'Status',
      'Nominal (Rp)',
    ],
    ...report.entries.map((entry, index) => [
      index + 1,
      formatDateId(entry.date),
      entry.categoryLabel,
      entry.label,
      entry.method,
      entry.reference,
      entry.status,
      entry.amount,
    ]),
  ];

  if (report.entries.length === 0) {
    entryRows.push([
      '-',
      '-',
      '-',
      'Tidak ada transaksi pada periode ini',
      '-',
      '-',
      '-',
      0,
    ]);
  }

  return buildXlsx([
    {
      name: 'Info Laporan',
      headerRow: false,
      columns: [{ width: 34 }, { width: 60 }],
      rows: infoRows,
    },
    {
      name: 'Ringkasan Kategori',
      freezeHeader: true,
      columns: [{ width: 28 }, { width: 18 }, { width: 20 }],
      rows: summaryRows,
    },
    {
      name: 'Per Metode',
      freezeHeader: true,
      columns: [{ width: 28 }, { width: 18 }, { width: 20 }],
      rows: methodRows,
    },
    {
      name: 'Per Bulan',
      freezeHeader: true,
      columns: [{ width: 22 }, { width: 22 }],
      rows: monthRows,
    },
    {
      name: 'Rincian Transaksi',
      freezeHeader: true,
      autoFilter: true,
      columns: [
        { width: 5 },
        { width: 18 },
        { width: 20 },
        { width: 52 },
        { width: 18 },
        { width: 18 },
        { width: 14 },
        { width: 18 },
      ],
      rows: entryRows,
    },
  ]);
}
