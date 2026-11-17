'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAutoCloseStates } from '../api/events.api';
import type { AutoCloseState } from '../types/event.types';

export interface UseAutoCloseResult {
  states: Record<string, AutoCloseState>;
  reload: () => Promise<void>;
}

export function useAutoClose(): UseAutoCloseResult {
  const [states, setStates] = useState<Record<string, AutoCloseState>>({});

  const load = useCallback(async () => {
    try {
      const items = await getAutoCloseStates();
      const map: Record<string, AutoCloseState> = {};
      for (const item of items) map[item.id] = item;
      setStates(map);
    } catch {
      // Local timeline computation keeps the UI correct.
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { states, reload: load };
}
