'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { useEvents } from '../hooks/use-events';
import { useAutoClose } from '../hooks/use-auto-close';
import { useEventForm } from '../hooks/use-event-form';
import type { EventCategory, EventItem } from '../types/event.types';
import { EventCategoryPills } from '../components/event-category-pills';
import { EventCard } from '../components/event-card';
import { EventsToast } from '../components/events-toast';
import { EventFormModal } from '../components/event-form-modal';

type ToastState = { message: string; type: 'success' | 'error' } | null;

interface AdminEventsPageProps {
  initialCategory?: 'ALL' | EventCategory;
}

export function AdminEventsPage({
  initialCategory = 'ALL',
}: AdminEventsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const events = useEvents();
  const autoClose = useAutoClose();
  const form = useEventForm({
    onSaved: events.reload,
    onDeleted: events.removeEvent,
  });
  const [activeCategory, setActiveCategory] =
    useState<'ALL' | EventCategory>(initialCategory);
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const query =
      activeCategory === 'ALL'
        ? ''
        : `?kategori=${encodeURIComponent(activeCategory)}`;
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [activeCategory, pathname, router]);

  const filtered =
    activeCategory === 'ALL'
      ? events.events
      : events.events.filter((event) => event.category === activeCategory);

  const handleDelete = async (event: EventItem) => {
    if (!confirm(`Hapus kegiatan "${event.title}"?`)) return;
    const result = await form.remove(event);
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleSubmit = async () => {
    const result = await form.submit();
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <EventsToast toast={toast} />
      <SectionTitle
        title="Manajemen Kegiatan"
        description="Kelola agenda, kuota, dan status kegiatan."
        action={
          <Button size="sm" onClick={form.openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah Kegiatan
          </Button>
        }
      />

      <EventCategoryPills activeCategory={activeCategory} onSelect={setActiveCategory} />

      {events.loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : events.error ? (
        <div className="flex items-center justify-between rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{events.error}</p>
          <Button size="sm" variant="danger" onClick={() => void events.reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-card border border-surface-soft bg-white p-8 text-center">
          <p className="text-sm font-semibold text-ink">Belum ada kegiatan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              autoCloseState={autoClose.states[event.id] ?? null}
              canManage
              showRegister={false}
              deleting={form.deletingId === event.id}
              registering={false}
              onRegister={() => undefined}
              onEdit={() => form.openEdit(event)}
              onDelete={() => void handleDelete(event)}
            />
          ))}
        </div>
      )}

      <EventFormModal
        open={form.formOpen}
        editingEvent={form.editingEvent}
        form={form.form}
        bannerPreview={form.bannerPreview}
        submitting={form.submitting}
        quotaFloor={form.quotaFloor}
        onChange={form.setField}
        onBannerChange={form.selectBanner}
        onClose={form.close}
        onSubmit={() => void handleSubmit()}
      />
    </div>
  );
}
