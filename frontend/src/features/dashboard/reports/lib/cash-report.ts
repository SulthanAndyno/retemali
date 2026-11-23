import { toNumber } from '@/shared/lib/format';
import {
  CASH_CATEGORY_LABELS,
  CASH_CATEGORY_ORDER,
} from './cash-categories';
import type {
  CashCategory,
  CashEntry,
  CashFilters,
  CashReport,
  UpstreamCashReport,
  UpstreamCashTransaction,
} from '../types/report.types';

const METHOD_LABELS: Record<string, string> = {
  QRIS: 'QRIS',
  BANK_MANDIRI: 'Bank Mandiri',
  BANK_BCA: 'Bank BCA',
  BANK_TRANSFER: 'Transfer Bank',
  CASH: 'Tunai / Loket',
  TUNAI: 'Tunai / Loket',
  GOPAY: 'GoPay',
  OVO: 'OVO',
  DANA: 'DANA',
  SHOPEEPAY: 'ShopeePay',
  SISTEM: 'Sistem',
};

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function labelPaymentMethod(method: string): string {
  return METHOD_LABELS[method] ?? method;
}

function toCategory(source: UpstreamCashTransaction['source']): CashCategory {
  if (source === 'EVENT_TICKET') return 'TIKET_KEGIATAN';
  if (source === 'CIRCULATION_FINE') return 'DENDA_SIRKULASI';
  return 'DONASI_FINANSIAL';
}

function toEntry(transaction: UpstreamCashTransaction): CashEntry {
  const category = toCategory(transaction.source);
  const label =
    transaction.source === 'DONATION'
      ? `${transaction.payerOrDonor}${transaction.title ? ` • ${transaction.title}` : ''}`
      : transaction.title;

  return {
    id: transaction.id,
    date: transaction.date,
    category,
    categoryLabel: CASH_CATEGORY_LABELS[category],
    label: label || '-',
    method: labelPaymentMethod(transaction.paymentMethod),
    reference: transaction.referenceCode || '-',
    amount: toNumber(transaction.amount),
    status:
      transaction.source === 'CIRCULATION_FINE' ? 'RETURNED' : 'VERIFIED',
  };
}

export function buildCashReport(
  payload: UpstreamCashReport,
  filters: CashFilters,
  generatedAt: string
): CashReport {
  const entries = (payload.transactions ?? [])
    .map(toEntry)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sumBy = (category: CashCategory) =>
    entries
      .filter((entry) => entry.category === category)
      .reduce((total, entry) => total + entry.amount, 0);

  const summary = payload.summary;
  const fallbackTotal = entries.reduce((total, entry) => total + entry.amount, 0);
  const donationIncome = summary?.totalDonations
    ? toNumber(summary.totalDonations)
    : sumBy('DONASI_FINANSIAL');
  const eventTicketIncome = summary?.totalEventTicket
      ? toNumber(summary.totalEventTicket)
      : sumBy('TIKET_KEGIATAN');
  const fineIncome = summary?.totalFines
    ? toNumber(summary.totalFines)
    : sumBy('DENDA_SIRKULASI');
  const totalIncome = summary?.totalIncome
    ? toNumber(summary.totalIncome)
    : fallbackTotal || donationIncome + eventTicketIncome + fineIncome;

  const byCategory = CASH_CATEGORY_ORDER.map((category) => {
    const subset = entries.filter((entry) => entry.category === category);
    return {
      category,
      label: CASH_CATEGORY_LABELS[category],
      amount: subset.reduce((total, entry) => total + entry.amount, 0),
      count: subset.length,
    };
  });

  const methodMap = new Map<string, { amount: number; count: number }>();
  for (const entry of entries) {
    const current = methodMap.get(entry.method) ?? { amount: 0, count: 0 };
    methodMap.set(entry.method, {
      amount: current.amount + entry.amount,
      count: current.count + 1,
    });
  }
  if (methodMap.size === 0 && payload.byPaymentMethod) {
    for (const [method, amount] of Object.entries(payload.byPaymentMethod)) {
      methodMap.set(labelPaymentMethod(method), { amount: toNumber(amount), count: 0 });
    }
  }
  const byMethod = Array.from(methodMap.entries())
    .map(([method, value]) => ({ method, ...value }))
    .sort((a, b) => b.amount - a.amount);

  const monthMap = new Map<string, number>();
  for (const entry of entries) {
    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + entry.amount);
  }
  const byMonth = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, income]) => {
      const [year, monthNumber] = month.split('-');
      return {
        month,
        label: `${MONTHS_ID[Number(monthNumber) - 1]} ${year}`,
        income,
      };
    });

  return {
    generatedAt,
    period: { from: filters.from || null, to: filters.to || null },
    summary: {
      totalIncome,
      totalExpense: 0,
      netCashFlow: totalIncome,
      donationIncome,
      eventTicketIncome,
      fineIncome,
      transactionCount: summary?.totalTransactions
        ? toNumber(summary.totalTransactions)
        : entries.length,
    },
    byCategory,
    byMethod,
    byMonth,
    entries,
    dataSources: { donations: true, events: true, loans: true },
    expenseTracking: {
      available: false,
      reason:
        'Backend belum menyediakan pencatatan pengeluaran kas, sehingga laporan ini hanya merekam arus kas masuk.',
    },
  };
}
