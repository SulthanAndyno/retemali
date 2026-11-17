'use client';

import { CalendarDays } from 'lucide-react';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth';
import { useMemberTickets } from '../hooks/use-member-tickets';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { TicketCard } from '../components/ticket-card';

export function MemberActivitiesPage() {
  const { user } = useAuth();
  const { tickets, loading, error, reload } = useMemberTickets();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Kegiatan Saya"
        description={
          user
            ? `Member: ${user.name} — Nomor ${user.memberCode}`
            : 'Riwayat kegiatan yang Anda ikuti beserta status pendaftarannya.'
        }
      />

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{error}</p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={<CalendarDays aria-hidden />}
          title="Belum ada kegiatan yang diikuti"
          description="Jelajahi daftar kegiatan komunitas dan registrasikan diri Anda pada kegiatan menarik."
          action={
            <LinkButton href="/kegiatan" size="sm">
              Jelajahi kegiatan
            </LinkButton>
          }
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
