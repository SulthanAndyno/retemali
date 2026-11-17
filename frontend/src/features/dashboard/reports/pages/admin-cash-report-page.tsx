'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCashPeriod } from '../hooks/use-cash-period';
import { useCashReport } from '../hooks/use-cash-report';
import { useReportToast } from '../hooks/use-report-toast';
import { useReportExport } from '../hooks/use-report-export';
import { cashParams } from '../lib/report-query';
import { CashPeriodCard } from '../components/cash-period-card';
import { CashSummaryCard } from '../components/cash-summary-card';
import { CashExpenseNotice } from '../components/cash-expense-notice';
import { CashCategoryBreakdown } from '../components/cash-category-breakdown';
import { CashMethodMonthGrid } from '../components/cash-method-month-grid';
import { CashLedgerList } from '../components/cash-ledger-list';
import { ReportErrorCard } from '../components/report-error-card';
import { ReportSourceWarnings } from '../components/report-source-warnings';
import { ReportToast } from '../components/report-toast';

interface AdminCashReportPageProps {
  initialFrom?: string;
  initialTo?: string;
}

export function AdminCashReportPage({
  initialFrom = '',
  initialTo = '',
}: AdminCashReportPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const period = useCashPeriod({ from: initialFrom, to: initialTo });
  const { report, loading, error, reload } = useCashReport(period.applied);
  const { toast, showToast } = useReportToast();
  const exporter = useReportExport();

  useEffect(() => {
    const params = new URLSearchParams();
    if (period.applied.from) params.set('dari', period.applied.from);
    if (period.applied.to) params.set('sampai', period.applied.to);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [period.applied, pathname, router]);

  const handleExport = async () => {
    const result = await exporter.download(
      '/api/reports/cash/export',
      cashParams(period.applied),
      'laporan-kas.xlsx'
    );
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const showBreakdown =
    Boolean(report) &&
    ((report?.byMethod.length ?? 0) > 0 || (report?.byMonth.length ?? 0) > 0);

  return (
    <div className="space-y-4">
      <ReportToast toast={toast} />
      <CashPeriodCard
        preset={period.preset}
        from={period.from}
        to={period.to}
        loading={loading}
        exporting={exporter.exporting}
        canExport={Boolean(report)}
        onSelectPreset={period.selectPreset}
        onFromChange={period.setFrom}
        onToChange={period.setTo}
        onApply={period.apply}
        onExport={() => void handleExport()}
      />

      {error ? (
        <ReportErrorCard message={error.message} onRetry={() => void reload()} />
      ) : null}

      <CashSummaryCard summary={report?.summary} period={period.applied} loading={loading} />
      <CashExpenseNotice
        reason={report?.expenseTracking.reason}
        netCashFlow={report?.summary.netCashFlow}
      />
      <CashCategoryBreakdown rows={report?.byCategory ?? []} loading={loading} />

      {!loading && showBreakdown && report ? (
        <CashMethodMonthGrid byMethod={report.byMethod} byMonth={report.byMonth} />
      ) : null}

      <CashLedgerList entries={report?.entries ?? []} loading={loading} />
      <ReportSourceWarnings dataSources={report?.dataSources} />
    </div>
  );
}
