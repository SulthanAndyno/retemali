import { Activity } from 'lucide-react';
import { formatAuditLog } from '../lib/admin-format';
import type { SystemAuditLog } from '../types/admin.types';

interface AuditLogCardProps {
  logs: SystemAuditLog[];
  loading: boolean;
}

export function AuditLogCard({ logs, loading }: AuditLogCardProps) {
  const entries = logs.map((log) => formatAuditLog(log));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-gray-600" />
        <h2 className="font-semibold text-gray-900 text-sm">Audit Aktivitas Sistem</h2>
        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
          Live Feed
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Belum ada log aktivitas</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: entry.color || '#6b7280' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{entry.title}</p>
                  <p className="text-xs text-gray-400 flex-shrink-0">{entry.timeAgo}</p>
                </div>
                <p className="text-xs text-gray-500 truncate">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
