'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
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

interface AdminAttendanceReportPageProps {
  initialFrom?: string;
  initialTo?: string;
  initialEventId?: string;
}

export function AdminAttendanceReportPage({
  initialFrom = '',
  initialTo = '',
  initialEventId = '',
}: AdminAttendanceReportPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const filters = useReportFilters({
    from: initialFrom,
    to: initialTo,
    eventId: initialEventId,
  });
  const { report, loading, error, reload } = useAttendanceReport(filters.applied);
  const { toast, showToast } = useReportToast();
  const exporter = useReportExport();
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.applied.from) params.set('dari', filters.applied.from);
    if (filters.applied.to) params.set('sampai', filters.applied.to);
    if (filters.applied.eventId) params.set('kegiatan', filters.applied.eventId);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [filters.applied, pathname, router]);

  const handleExport = async () => {
    const result = await exporter.download(
      '/api/reports/attendance/export',
      attendanceParams(filters.applied),
      'laporan-presensi.xlsx'
    );
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <ReportToast toast={toast} />
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
        <p className="text-xs text-ink-soft text-center flex items-center justify-center gap-1">
          <Download size={12} />
          Dibuat {formatDateTimeId(report.generatedAt)}
        </p>
      ) : null}
    </div>
  );
}
