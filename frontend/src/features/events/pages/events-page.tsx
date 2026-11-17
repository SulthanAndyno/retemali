'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/features/auth';
import { useEvents } from '../hooks/use-events';
import { useAutoClose } from '../hooks/use-auto-close';
import { useEventRegistration } from '../hooks/use-event-registration';
import { useEventForm } from '../hooks/use-event-form';
import type { EventCategory, EventItem } from '../types/event.types';
import { EventsHero } from '../components/events-hero';
import { EventCategoryPills } from '../components/event-category-pills';
import { EventCard } from '../components/event-card';
import { EventsToast } from '../components/events-toast';
import { EventsLoading } from '../components/events-loading';
import { EventsError } from '../components/events-error';
import { EventFormModal } from '../components/event-form-modal';
import { PaidRegistrationModal } from '../components/paid-registration-modal';

type ToastState = { message: string; type: 'success' | 'error' } | null;

export function EventsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const events = useEvents();
  const autoClose = useAutoClose();
  const form = useEventForm({
    onSaved: events.reload,
    onDeleted: events.removeEvent,
  });
  const registration = useEventRegistration({
    loggedIn: Boolean(user),
    onRequireLogin: () => router.push('/login'),
    onRegistered: events.markRegistered,
  });

  const [activeCategory, setActiveCategory] = useState<'ALL' | EventCategory>('ALL');
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const canManage = user?.role === 'ADMIN';

  const filteredEvents =
    activeCategory === 'ALL'
      ? events.events
      : events.events.filter((event) => event.category === activeCategory);

  const handleRegister = async (event: EventItem) => {
    const result = await registration.register(event);
    if (result) showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleSubmitPaid = async () => {
    const result = await registration.submitPaid();
    if (result) showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleFormSubmit = async () => {
    const result = await form.submit();
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  const handleDelete = async (event: EventItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kegiatan "${event.title}"?`)) {
      return;
    }
    const result = await form.remove(event);
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/50 pb-24 text-slate-800">
      <EventsToast toast={toast} />
      <Header />

      <main className="px-4 pt-3 space-y-4">
        <EventsHero canCreate={canManage} onCreate={form.openCreate} />

        <EventCategoryPills
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {events.loading && events.events.length === 0 ? (
          <EventsLoading />
        ) : events.error && events.events.length === 0 ? (
          <EventsError message={events.error} onRetry={() => void events.reload()} />
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Belum ada kegiatan</p>
            <p className="text-xs text-slate-500 mt-1">
              Coba pilih kategori lain atau kembali lagi nanti.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                autoCloseState={autoClose.states[event.id] ?? null}
                canManage={canManage}
                deleting={form.deletingId === event.id}
                registering={registration.registeringId === event.id}
                onRegister={() => void handleRegister(event)}
                onEdit={() => form.openEdit(event)}
                onDelete={() => void handleDelete(event)}
              />
            ))}
          </div>
        )}
      </main>

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
        onSubmit={() => void handleFormSubmit()}
      />

      <PaidRegistrationModal
        event={registration.registerTarget}
        proofFile={registration.proofFile}
        proofPreview={registration.proofPreview}
        registering={registration.registeringId !== null}
        onSelectProof={registration.selectProof}
        onClose={registration.closeModal}
        onSubmit={() => void handleSubmitPaid()}
      />

      <BottomNav />
    </div>
  );
}
