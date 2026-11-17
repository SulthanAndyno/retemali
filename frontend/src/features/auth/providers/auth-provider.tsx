'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/features/auth/types';

export type { User } from '@/features/auth/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const payload = await readJson<AuthResponse>(response);
      setUser(payload?.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('retemali_token');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, password }),
    });

    const payload = await readJson<AuthResponse>(response);

    if (!response.ok || !payload?.data?.user) {
      throw new Error(payload?.message ?? 'Login gagal. Periksa email & password.');
    }

    setUser(payload.data.user);
    return payload.data.user;
  }, []);

  const logout = useCallback(() => {
    void fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    }).finally(() => {
      setUser(null);
      router.push('/login');
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
