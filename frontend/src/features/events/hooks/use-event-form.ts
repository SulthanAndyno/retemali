'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getImageUrl } from '@/shared/lib/utils';
import { normalizeCloseOffsetDays } from '@/shared/lib/event-timeline';
import { createEvent, deleteEvent, updateEvent } from '../api/events.api';
import { DEFAULT_EVENT_LOCATION } from '../lib/event-options';
import type { EventActionResult, EventFormValues, EventItem } from '../types/event.types';

function emptyForm(): EventFormValues {
  return {
    title: '',
    category: 'DONGENG',
    description: '',
    facilitatorName: '',
    location: DEFAULT_EVENT_LOCATION,
    eventDate: new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:30',
    quota: 30,
    feeType: 'FREE',
    ticketPrice: 0,
    registrationCloseOffsetDays: 1,
  };
}

export interface UseEventFormResult {
  formOpen: boolean;
  editingEvent: EventItem | null;
  form: EventFormValues;
  bannerPreview: string | null;
  submitting: boolean;
  deletingId: string | null;
  quotaFloor: number;
  openCreate: () => void;
  openEdit: (event: EventItem) => void;
  close: () => void;
  setField: <K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K]
  ) => void;
  selectBanner: (file: File | null) => void;
  submit: () => Promise<EventActionResult>;
  remove: (event: EventItem) => Promise<EventActionResult>;
}

interface UseEventFormOptions {
  onSaved: () => void | Promise<void>;
  onDeleted: (id: string) => void;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useEventForm({
  onSaved,
  onDeleted,
}: UseEventFormOptions): UseEventFormResult {
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventFormValues>(emptyForm);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokePreview = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  useEffect(() => {
    return () => {
      revokePreview();
    };
  }, []);

  const quotaFloor = editingEvent ? Math.max(1, editingEvent.registeredCount) : 1;

  const openCreate = () => {
    revokePreview();
    setEditingEvent(null);
    setForm(emptyForm());
    setBannerFile(null);
    setBannerPreview(null);
    setFormOpen(true);
  };

  const openEdit = (event: EventItem) => {
    revokePreview();
    setEditingEvent(event);
    setForm({
      title: event.title ?? '',
      category: event.category ?? 'DONGENG',
      description: event.description ?? '',
      facilitatorName: event.facilitatorName ?? '',
      location: event.location ?? DEFAULT_EVENT_LOCATION,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split('T')[0]
        : '',
      startTime: event.startTime ?? '09:00',
      endTime: event.endTime ?? '11:30',
      quota: event.quota || 30,
      feeType: event.feeType ?? 'FREE',
      ticketPrice: Number(event.ticketPrice ?? 0),
      registrationCloseOffsetDays: normalizeCloseOffsetDays(
        event.registrationCloseOffsetDays
      ) as EventFormValues['registrationCloseOffsetDays'],
    });
    setBannerFile(null);
    setBannerPreview(event.bannerImage ? getImageUrl(event.bannerImage) : null);
    setFormOpen(true);
  };

  const close = () => {
    setFormOpen(false);
    setEditingEvent(null);
    revokePreview();
    setBannerFile(null);
    setBannerPreview(null);
  };

  const setField = <K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const selectBanner = (file: File | null) => {
    revokePreview();
    setBannerFile(file);
    if (!file) {
      setBannerPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setBannerPreview(objectUrl);
  };

  const submit = async (): Promise<EventActionResult> => {
    if (form.title.trim().length < 5) {
      return { ok: false, message: 'Judul kegiatan minimal 5 karakter' };
    }
    if (form.description.trim().length < 10) {
      return { ok: false, message: 'Deskripsi kegiatan minimal 10 karakter' };
    }
    if (!form.eventDate) {
      return { ok: false, message: 'Pilih tanggal kegiatan' };
    }
    if (!Number.isFinite(form.quota) || form.quota < 1) {
      return { ok: false, message: 'Kuota peserta minimal 1 orang' };
    }
    if (editingEvent && form.quota < quotaFloor) {
      return {
        ok: false,
        message: `Kuota tidak boleh kurang dari ${quotaFloor} — sudah ada ${editingEvent.registeredCount} peserta terdaftar`,
      };
    }

    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, form, bannerFile);
      } else {
        await createEvent(form, bannerFile);
      }
      await onSaved();
      const wasEditing = Boolean(editingEvent);
      close();
      return {
        ok: true,
        message: wasEditing
          ? 'Kegiatan berhasil diperbarui!'
          : 'Kegiatan baru berhasil diterbitkan!',
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal menyimpan kegiatan'),
      };
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (event: EventItem): Promise<EventActionResult> => {
    setDeletingId(event.id);
    try {
      await deleteEvent(event.id);
      onDeleted(event.id);
      return { ok: true, message: 'Kegiatan berhasil dihapus' };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, 'Gagal menghapus kegiatan'),
      };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    formOpen,
    editingEvent,
    form,
    bannerPreview,
    submitting,
    deletingId,
    quotaFloor,
    openCreate,
    openEdit,
    close,
    setField,
    selectBanner,
    submit,
    remove,
  };
}
