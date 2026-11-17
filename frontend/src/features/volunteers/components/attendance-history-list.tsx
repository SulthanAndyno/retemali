import { Card } from '@/shared/components/ui/card';
import { formatDateTimeId } from '@/shared/lib/format';
import type { VolunteerAttendanceRecord } from '../types/volunteer-page.types';

export function AttendanceHistoryList({
  records,
  limit,
}: {
  records: VolunteerAttendanceRecord[];
  limit?: number;
}) {
  const rows = typeof limit === 'number' ? records.slice(0, limit) : records;

  return (
    <div className="space-y-2">
      {rows.map((record) => (
        <Card
          key={record.id}
          className="flex flex-wrap items-center justify-between gap-2"
        >
          <span className="text-sm font-semibold text-primary-deep">
            {record.title}
          </span>
          <span className="text-xs text-ink-soft">
            {formatDateTimeId(record.scannedAt)}
          </span>
        </Card>
      ))}
    </div>
  );
}
