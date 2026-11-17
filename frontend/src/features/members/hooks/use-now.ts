'use client';

import { useEffect, useState } from 'react';

/** Waktu client yang stabil setelah mount, aman untuk render React. */
export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  return now;
}
