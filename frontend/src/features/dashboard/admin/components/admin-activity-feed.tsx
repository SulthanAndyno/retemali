import { Badge } from '@/shared/components/ui/badge';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDateTimeId } from '@/shared/lib/format';
import type { AdminAuditLogSnapshot } from '../types/admin.types';

interface AdminActivityFeedProps {
  logs: AdminAuditLogSnapshot[];
  loading: boolean;
}

export function AdminActivityFeed({ logs, loading }: AdminActivityFeedProps) {
  return (
    <section>
      <SectionTitle
        title="Aktivitas Terbaru"
        description="Log aktivitas sistem, donasi, dan operasional terkini."
      />
      {loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : logs.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" />
      ) : (
        <Card padded={false}>
          <ul className="divide-y divide-surface-soft">
            {logs.slice(0, 6).map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">{log.title}</div>
                  <div className="text-xs text-ink-soft">
                    {log.description} • {formatDateTimeId(log.createdAt)}
                  </div>
                </div>
                <Badge tone="info">{log.category}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
