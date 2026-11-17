'use client';

import { useCallback, useState } from 'react';
import { saveHandoverNote } from '../api/volunteer.api';
import { errorMessage } from '../lib/volunteer-error';
import type { ActionResult, ShiftType } from '../types/volunteer.types';

export interface UseHandoverNoteResult {
  content: string;
  tags: string[];
  pending: boolean;
  setContent: (value: string) => void;
  toggleTag: (tag: string) => void;
  save: () => Promise<ActionResult>;
}

export function useHandoverNote(shiftType: ShiftType): UseHandoverNoteResult {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  }, []);

  const save = useCallback(async (): Promise<ActionResult> => {
    const cleanContent = content.trim();
    if (!cleanContent) {
      return { ok: false, message: 'Tuliskan catatan terlebih dahulu' };
    }

    setPending(true);
    try {
      await saveHandoverNote({
        shiftType,
        content: cleanContent,
        tags,
      });
      setContent('');
      setTags([]);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: errorMessage(err, 'Gagal menyimpan catatan piket'),
      };
    } finally {
      setPending(false);
    }
  }, [content, tags, shiftType]);

  return { content, tags, pending, setContent, toggleTag, save };
}
