'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useReportFilters } from '../hooks/use-report-filters';
import { useAttendanceReport } from '../hooks/use-attendance-report';
import { useReportToast } from '../hooks/use-report-toast';
import { useReportExport } from '../hooks/use-report-export';
import { attendanceParams } from '../lib/report-query';
import { formatDateTimeId } from '../lib/report-format';
import { AttendanceFilterCard } from '../components/attendance-filter-card';
import { AttendanceKpiGrid } from '../components/attendance-kpi-grid';
import { AutoClosedNotice } from '../components/auto-closed-notice';
import { AttendanceEventList } from '../components/attendance-event-list';
import { ReportErrorCard } from '../components/report-error-card';
import { ReportToast } from '../components/report-toast';

export function AttendanceReportPage() {
  const router = useRouter();
  const filters = useReportFilters();
  const { report, loading, error, reload } = useAttendanceReport(filters.applied);
  const { toast, showToast } = useReportToast();
  const exporter = useReportExport();
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/login?next=%2Fdashboard%2Fadmin%2Freports%2Fattendance');
    } else if (error?.status === 403) {
      router.replace('/portal');
    }
  }, [error, router]);

  const handleExport = async () => {
    const result = await exporter.download(
      '/api/reports/attendance/export',
      attendanceParams(filters.applied),
      'laporan-presensi.xlsx'
    );
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/60 pb-16 text-slate-800">
      <ReportToast toast={toast} />
      <Header title="Laporan Presensi" subtitle="Rekap kehadiran kegiatan" showBack />

      <main className="px-4 pt-4 space-y-4">
        <AttendanceFilterCard
          from={filters.from}
          to={filters.to}
          eventId={filters.eventId}
          eventOptions={filters.eventOptions}
          loading={loading}
          exporting={exporter.exporting}
          canExport={Boolean(report)}
          onFromChange={filters.setFrom}
          onToChange={filters.setTo}
          onEventChange={filters.setEventId}
          onApply={filters.apply}
          onReset={filters.reset}
          onExport={() => void handleExport()}
        />

        {error ? (
          <ReportErrorCard message={error.message} onRetry={() => void reload()} />
        ) : null}

        <AttendanceKpiGrid totals={report?.totals} loading={loading} />

        {!loading && (report?.totals.autoClosedEvents ?? 0) > 0 && (
          <AutoClosedNotice count={report?.totals.autoClosedEvents ?? 0} />
        )}

        <AttendanceEventList
          loading={loading}
          events={report?.events ?? []}
          expandedEventId={expandedEventId}
          onToggle={(eventId) =>
            setExpandedEventId((current) => (current === eventId ? null : eventId))
          }
        />

        {report ? (
          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Download size={11} />
            Dibuat {formatDateTimeId(report.generatedAt)}
          </p>
        ) : null}
      </main>
    </div>
  );
}
