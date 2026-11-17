import { BookOpen, CheckCircle2, Ticket } from 'lucide-react';
import { MetricChip } from './metric-chip';
import type { TodayMetrics } from '../types/volunteer.types';

interface MetricGridProps {
  metrics: TodayMetrics;
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <MetricChip
        icon={<BookOpen size={19} />}
        iconClassName="bg-blue-50 text-blue-600"
        value={metrics.borrowedToday}
        label="Buku Dipinjam"
      />
      <MetricChip
        icon={<CheckCircle2 size={19} />}
        iconClassName="bg-emerald-50 text-emerald-600"
        value={metrics.returnedToday}
        label="Dikembalikan"
      />
      <MetricChip
        icon={<CheckCircle2 size={19} />}
        iconClassName="bg-teal-50 text-teal-600"
        value={metrics.overdueCount}
        label="Terlambat/Denda"
      />
      <MetricChip
        icon={<Ticket size={19} />}
        iconClassName="bg-sky-50 text-sky-600"
        value={
          <>
            {metrics.checkedInTickets}
            <span className="text-xs text-slate-400 font-normal">
              /{metrics.totalEventQuota}
            </span>
          </>
        }
        label="Tiket Hadir"
      />
    </div>
  );
}
