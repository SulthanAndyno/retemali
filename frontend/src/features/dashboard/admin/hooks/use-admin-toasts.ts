'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AdminToastType = 'success' | 'error';

export interface AdminToast {
  id: number;
  message: string;
  type: AdminToastType;
}

export interface UseAdminToastsResult {
  toasts: AdminToast[];
  addToast: (message: string, type: AdminToastType) => void;
  removeToast: (id: number) => void;
}

export function useAdminToasts(): UseAdminToastsResult {
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: AdminToastType) => {
      const id = ++nextIdRef.current;
      setToasts((current) => [...current, { id, message, type }]);
      timersRef.current.set(id, setTimeout(() => removeToast(id), 4000));
    },
    [removeToast]
  );

  useEffect(
    () => () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer);
      timersRef.current.clear();
    },
    []
  );

  return { toasts, addToast, removeToast };
}
