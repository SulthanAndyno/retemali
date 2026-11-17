import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDateId } from '@/shared/lib/format';
import type { VolunteerAssignment } from '../types/volunteer-page.types';

interface UpcomingAssignmentCardProps {
  assignment: VolunteerAssignment;
  showBadge?: boolean;
}

export function UpcomingAssignmentCard({
  assignment,
  showBadge = false,
}: UpcomingAssignmentCardProps) {
  return (
    <Card className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold text-ink">{assignment.title}</p>
        {showBadge ? <Badge tone="success">Terjadwal</Badge> : null}
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
