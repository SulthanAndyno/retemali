'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useAuth } from './auth-provider';

export type ActiveRole = 'MEMBER' | 'VOLUNTEER' | 'ADMIN';
export type SwitchableRole = 'MEMBER' | 'VOLUNTEER';
export type RoleMode = 'ACCOUNT' | 'PREVIEW' | 'SWITCHED';

export interface RoleSwitchResult {
  activeRole: ActiveRole;
  mode: RoleMode;
  persisted: boolean;
  note: string;
}

interface RoleContextValue {
  activeRole: ActiveRole;
  accountRole: ActiveRole | null;
  mode: RoleMode;
  isVolunteerMode: boolean;
  canSwitchVolunteer: boolean;
  switching: boolean;
  note: string | null;
  switchRole: (role: SwitchableRole) => Promise<RoleSwitchResult | null>;
  resetToAccountRole: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = 'retemali_active_role';
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function setStoredRole(role: SwitchableRole | null): void {
  if (role) window.localStorage.setItem(STORAGE_KEY, role);
  else window.localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}

/**
 * Client-side "active role" for the volunteer switch.
 *
 * The account's real role lives in the database and is enforced by the API;
 * this context only decides which workspace the UI presents. Only accounts
 * that actually hold the VOLUNTEER role may switch modes.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storedRole = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [switching, setSwitching] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const accountRole = (user?.role ?? null) as ActiveRole | null;
  const preferred: SwitchableRole | null =
    storedRole === 'MEMBER' || storedRole === 'VOLUNTEER' ? storedRole : null;

  useEffect(() => {
    if (accountRole && accountRole !== 'VOLUNTEER' && storedRole) {
      setStoredRole(null);
    }
  }, [accountRole, storedRole]);

  const activeRole = useMemo<ActiveRole>(() => {
    if (!accountRole) return 'MEMBER';
    if (accountRole === 'VOLUNTEER') {
      return preferred === 'MEMBER' ? 'MEMBER' : 'VOLUNTEER';
    }
    return accountRole;
  }, [accountRole, preferred]);

  const mode = useMemo<RoleMode>(() => {
    if (!accountRole || activeRole === accountRole) return 'ACCOUNT';
    return 'SWITCHED';
  }, [accountRole, activeRole]);

  const canSwitchVolunteer = accountRole === 'VOLUNTEER';

  const switchRole = useCallback(
    async (role: SwitchableRole): Promise<RoleSwitchResult | null> => {
      if (!canSwitchVolunteer) {
        throw new Error(
          'Mode relawan hanya tersedia untuk akun dengan peran Relawan.'
        );
      }
      setSwitching(true);
      try {
        const response = await fetch('/api/role-switch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { status?: string; message?: string; data?: RoleSwitchResult }
          | null;

        if (!response.ok || !payload?.data) {
          throw new Error(payload?.message ?? 'Gagal mengganti peran.');
        }

        setStoredRole(role);
        setNote(payload.data.note);
        return payload.data;
      } finally {
        setSwitching(false);
      }
    },
    [canSwitchVolunteer]
  );

  const resetToAccountRole = useCallback(() => {
    setStoredRole(null);
    setNote(null);
  }, []);

  const value: RoleContextValue = {
    activeRole,
    accountRole,
    mode,
    isVolunteerMode: activeRole === 'VOLUNTEER',
    canSwitchVolunteer,
    switching,
    note,
    switchRole,
    resetToAccountRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
