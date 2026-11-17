import Link from 'next/link';
import { CalendarDays, MapPin, UserCog } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { formatDateId } from '@/shared/lib/format';
import type { VolunteerAssignment } from '../types/volunteer-page.types';

export function AssignmentCard({ assignment }: { assignment: VolunteerAssignment }) {
  const isUpcoming = assignment.phase === 'upcoming';

  return (
    <Card className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-ink">{assignment.title}</p>
        <Badge tone={isUpcoming ? 'success' : 'neutral'}>
          {isUpcoming ? 'Terjadwal' : 'Selesai'}
        </Badge>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-ink-soft">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
        {formatDateId(assignment.eventDate)} • {assignment.startTime}–
        {assignment.endTime} WIB
      </p>
      <p className="flex items-center gap-1.5 text-xs text-ink-soft">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        {assignment.location}
      </p>
      <p className="flex items-center gap-1.5 text-xs text-ink-soft">
        <UserCog className="h-3.5 w-3.5" aria-hidden />
        Koordinator: {assignment.coordinator}
      </p>
      <p className="text-sm text-ink">
        <span className="font-semibold">Tanggung jawab:</span>{' '}
        {assignment.responsibilities}
      </p>
      <Link
        href="/kegiatan"
        className="inline-flex items-center text-sm font-semibold text-primary-deep underline-offset-4 hover:underline"
      >
        Detail kegiatan
      </Link>
    </Card>
  );
}
