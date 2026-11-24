'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@/features/auth/types';

export type { User } from '@/features/auth/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    expectedRole?: User['role']
  ) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResponse {
  status: string;
  message?: string;
  data?: {
    user: User;
  };
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

const PROTECTED_PREFIXES = ['/member', '/volunteer', '/admin', '/portal', '/dashboard'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authEpochRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const epoch = authEpochRef.current;
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (epoch !== authEpochRef.current) return;

      if (response.status === 401 || response.status === 403) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        return;
      }

      const payload = await readJson<AuthResponse>(response);
      if (epoch !== authEpochRef.current) return;
      setUser(payload?.data?.user ?? null);
    } catch {
      // Abaikan gangguan jaringan sementara agar sesi valid tidak terhapus di state client.
    } finally {
      if (epoch === authEpochRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('retemali_token');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (!loading && !user && isProtected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void refreshUser();
    }
  }, [loading, user, pathname, refreshUser]);

  const login = useCallback(
    async (email: string, password: string, expectedRole?: User['role']) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(
          expectedRole ? { email, password, expectedRole } : { email, password }
        ),
      });

    const payload = await readJson<AuthResponse>(response);

    if (!response.ok || !payload?.data?.user) {
      throw new Error(payload?.message ?? 'Login gagal. Periksa email & password.');
    }

    authEpochRef.current += 1;
    setUser(payload.data.user);
    setLoading(false);
    return payload.data.user;
  }, []);

  const logout = useCallback(() => {
    authEpochRef.current += 1;
    void fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    }).finally(() => {
      setUser(null);
      router.push('/login');
      router.refresh();
    });
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
