'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
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

export function CashReportPage() {
  const router = useRouter();
  const period = useCashPeriod();
  const { report, loading, error, reload } = useCashReport(period.applied);
  const { toast, showToast } = useReportToast();
  const exporter = useReportExport();

  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/login?next=%2Fdashboard%2Fadmin%2Freports%2Fcash');
    } else if (error?.status === 403) {
      router.replace('/portal');
    }
  }, [error, router]);

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
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/60 pb-16 text-slate-800">
      <ReportToast toast={toast} />
      <Header title="Laporan Kas" subtitle="Arus kas & donasi" showBack />

      <main className="px-4 pt-4 space-y-4">
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

        <CashSummaryCard
          summary={report?.summary}
          period={period.applied}
          loading={loading}
        />

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
      </main>
    </div>
  );
}
