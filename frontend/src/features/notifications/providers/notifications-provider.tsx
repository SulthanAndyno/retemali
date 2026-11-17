'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useAuth } from '@/features/auth';
import type {
  ActivityNotification,
  NotificationFeed,
} from '@/shared/lib/notifications';

interface NotificationsContextValue {
  items: ActivityNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  auditLogAvailable: boolean;
  lastFetchedAt: string | null;
  refresh: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  isRead: (id: string) => boolean;
  resetReadState: () => void;
  toast: ActivityNotification | null;
  dismissToast: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined);

const READ_KEY = 'retemali_notif_read_ids';
const POLL_INTERVAL_MS = 60_000;
const MAX_READ_IDS = 300;
const EMPTY_READ_IDS: string[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedReadIds: string[] = EMPTY_READ_IDS;

function parseReadIds(raw: string | null): string[] {
  if (!raw) return EMPTY_READ_IDS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : EMPTY_READ_IDS;
  } catch {
    return EMPTY_READ_IDS;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === READ_KEY) listener();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getReadIdsSnapshot(): string[] {
  const raw = window.localStorage.getItem(READ_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedReadIds = parseReadIds(raw);
  }
  return cachedReadIds;
}

function getReadIdsServerSnapshot(): string[] {
  return EMPTY_READ_IDS;
}

function setStoredReadIds(ids: string[]): void {
  const next = ids.slice(0, MAX_READ_IDS);
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(next));
  } catch {
    // Storage full / disabled — read state falls back to memory per tab.
  }
  cachedRaw = JSON.stringify(next);
  cachedReadIds = next;
  listeners.forEach((listener) => listener());
}

/**
 * Polls the activity feed and tracks which entries the user has already seen.
 * Read state is stored per-browser because there is no read-receipt table.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const readIds = useSyncExternalStore(
    subscribe,
    getReadIdsSnapshot,
    getReadIdsServerSnapshot
  );

  const [items, setItems] = useState<ActivityNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditLogAvailable, setAuditLogAvailable] = useState(true);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const [toast, setToast] = useState<ActivityNotification | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const knownIdsRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notifications', {
        cache: 'no-store',
      });

      const payload = (await response.json().catch(() => null)) as
        | { status?: string; message?: string; data?: NotificationFeed }
        | null;

      if (!response.ok || !payload?.data) {
        throw new Error(
          payload?.message ?? 'Gagal memuat notifikasi aktivitas.'
        );
      }

      const feed = payload.data;
      const incoming = feed.items ?? [];

      const fresh = incoming.filter(
        (item) => !knownIdsRef.current.has(item.id)
      );
      const hadPrevious = knownIdsRef.current.size > 0;
      incoming.forEach((item) => knownIdsRef.current.add(item.id));

      setItems(incoming);
      setAuditLogAvailable(feed.auditLogAvailable !== false);
      setLastFetchedAt(feed.fetchedAt ?? new Date().toISOString());

      if (hadPrevious && fresh.length > 0) {
        setToast(fresh[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat notifikasi aktivitas.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      knownIdsRef.current = new Set();
      return;
    }

    const initialTimer = window.setTimeout(() => {
      void refresh();
    }, 0);
    const interval = window.setInterval(refresh, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user, refresh]);

  const visibleItems = useMemo(() => (user ? items : []), [user, items]);

  const unreadCount = useMemo(
    () => visibleItems.filter((item) => !readIds.includes(item.id)).length,
    [visibleItems, readIds]
  );

  const markRead = useCallback(
    (id: string) => {
      if (readIds.includes(id)) return;
      setStoredReadIds([id, ...readIds]);
    },
    [readIds]
  );

  const markAllRead = useCallback(() => {
    const next = Array.from(
      new Set([...items.map((item) => item.id), ...readIds])
    ).slice(0, MAX_READ_IDS);
    setStoredReadIds(next);
  }, [items, readIds]);

  const resetReadState = useCallback(() => {
    setStoredReadIds([]);
  }, []);

  const isRead = useCallback(
    (id: string) => readIds.includes(id),
    [readIds]
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const value: NotificationsContextValue = {
    items: visibleItems,
    unreadCount,
    loading,
    error,
    auditLogAvailable,
    lastFetchedAt,
    refresh,
    markRead,
    markAllRead,
    isRead,
    resetReadState,
    toast,
    dismissToast,
    panelOpen,
    setPanelOpen,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider'
    );
  }
  return context;
}
