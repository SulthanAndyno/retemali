'use client';

import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { AssignmentCard } from '../components/assignment-card';
import { useVolunteerPortalData } from '../hooks/use-volunteer-portal-data';

export function VolunteerActivitiesPage() {
  const { assignments, loading } = useVolunteerPortalData();
  const sorted = [...assignments].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Kegiatan Saya (Relawan)"
        description="Kegiatan yang Anda tugasi beserta tanggung jawab dan koordinator."
      />

      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="Belum ada kegiatan yang ditugaskan"
          description="Penugasan ditetapkan admin atau pengelola kegiatan. Jika belum ada, tunggu penugasan berikutnya atau hubungi koordinator."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}
