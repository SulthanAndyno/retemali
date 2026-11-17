'use client';

import Link from 'next/link';
import { ChevronRight, CircleCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import { formatDateTimeId } from '@/shared/lib/format';
import type { ActivityNotification } from '@/lib/notifications';

function kindLabel(item: ActivityNotification): string {
  if (item.kind === 'EVENT') return 'Kegiatan';
  if (item.kind === 'EVENT_CLOSED') return 'Kegiatan ditutup';
  return 'Aktivitas';
}

function severityTone(
  severity: ActivityNotification['severity']
): 'info' | 'success' | 'warning' {
  if (severity === 'success') return 'success';
  if (severity === 'warning') return 'warning';
  return 'info';
}

export function VolunteerNotificationsInbox() {
  const {
    items,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
    isRead,
  } = useNotifications();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft">
          {unreadCount > 0
            ? `${unreadCount} notifikasi belum dibaca`
            : 'Semua notifikasi telah dibaca'}
        </p>
        {unreadCount > 0 ? (
          <button
            type="button"
            className="text-sm font-semibold text-primary-deep hover:underline"
            onClick={markAllRead}
          >
            Tandai semua dibaca
          </button>
        ) : null}
      </div>

      {error ? (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-field border border-danger/30 bg-red-50 px-3 py-2.5 text-sm text-danger"
        >
          <span>{error}</span>
          <Button
            size="sm"
            variant="danger"
            onClick={() => void refresh()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <p className="text-sm text-ink-soft">Memuat notifikasi…</p>
      ) : null}

      {items.length === 0 && !error && !loading ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-surface-soft bg-white px-6 py-10 text-center">
          <CircleCheck className="h-6 w-6 text-ink-soft/60" aria-hidden />
          <p className="text-sm font-semibold text-ink">Belum ada notifikasi</p>
          <p className="text-xs text-ink-soft">
            Pemberitahuan kegiatan, pembayaran, donasi, dan absensi akan muncul
            di sini.
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="divide-y divide-surface-soft overflow-hidden rounded-card border border-surface-soft bg-white">
          {items.map((item) => {
            const read = isRead(item.id);

            return (
              <li
                key={item.id}
                className={`flex flex-wrap items-start justify-between gap-3 px-4 py-3 ${
                  read ? '' : 'bg-surface-blue/40'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={severityTone(item.severity)}>
                      {kindLabel(item)}
                    </Badge>
                    {!read ? (
                      <span className="text-[10px] font-bold uppercase text-primary-deep">
                        Belum dibaca
                      </span>
                    ) : null}
                    <span className="text-xs text-ink-soft/80">
                      {formatDateTimeId(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-ink">{item.title}</p>
                  <p className="text-sm text-ink-soft">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="rounded-field px-3 py-1.5 text-xs font-semibold text-primary-deep hover:bg-surface-blue"
                    >
                      <span className="flex items-center gap-1">
                        Buka
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </Link>
                  ) : null}
                  {!read ? (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      aria-label="Tandai dibaca"
                      className="flex items-center gap-1 rounded-field px-2 py-1.5 text-xs font-semibold text-ink-soft hover:bg-surface-blue hover:text-success"
                    >
                      <CircleCheck className="h-3.5 w-3.5" aria-hidden />
                      Dibaca
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
