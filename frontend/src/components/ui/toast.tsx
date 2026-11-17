'use client';

import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

const toneConfig: Record<ToastTone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: 'border-surface-soft text-primary-deep' },
  success: { icon: CheckCircle2, classes: 'border-emerald-200 text-success' },
  warning: { icon: TriangleAlert, classes: 'border-amber-200 text-[#8a5807]' },
  error: { icon: XCircle, classes: 'border-red-200 text-danger' },
};

const ToastContext = createContext<{
  toast: (message: string, tone?: ToastTone) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = 'info') => {
    const item: ToastItem = { id: Date.now() + Math.random(), tone, message };
    setItems((current) => [...current.slice(-3), item]);
    window.setTimeout(() => {
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {items.map((item) => {
          const { icon: Icon, classes } = toneConfig[item.tone];
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-field border bg-white px-4 py-3 text-sm font-medium shadow-pop ${classes}`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span>{item.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider');
  }
  return context;
}
