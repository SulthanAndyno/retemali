'use client';

import { useCallback, useEffect, useState } from 'react';
import { get } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';
import type {
  VolunteerAssignment,
  VolunteerAttendanceRecord,
} from '../types/volunteer-page.types';

interface BackendCommunityEvent {
  id: string;
  title: string;
  description: string;
  facilitatorName: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface BackendVolunteerShift {
  id: string;
  shiftType: string;
  location: string;
  taskSummary: string | null;
  clockInAt: string;
  approvalStatus: string;
}

export interface UseVolunteerPortalDataResult {
  assignments: VolunteerAssignment[];
  upcomingAssignments: VolunteerAssignment[];
  pastAssignments: VolunteerAssignment[];
  attendance: VolunteerAttendanceRecord[];
  loading: boolean;
  reload: () => Promise<void>;
}

export function useVolunteerPortalData(): UseVolunteerPortalDataResult {
  const [assignments, setAssignments] = useState<VolunteerAssignment[]>([]);
  const [attendance, setAttendance] = useState<VolunteerAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const now = Date.now();

    const [eventsRes, shiftsRes] = await Promise.allSettled([
      get<ApiEnvelope<BackendCommunityEvent[]> & { meta?: PaginatedMeta }>(
        '/events?limit=50'
      ),
      get<ApiEnvelope<BackendVolunteerShift[]> & { meta?: PaginatedMeta }>(
        '/volunteers/shifts?limit=50'
      ),
    ]);

    if (eventsRes.status === 'fulfilled') {
      const rows = eventsRes.value.data ?? [];
      const mapped: VolunteerAssignment[] = rows.map((event) => {
        const isUpcoming =
          event.status === 'PUBLISHED' &&
          new Date(event.eventDate).getTime() >= now;
        return {
          id: event.id,
          eventId: event.id,
          title: event.title,
          eventDate: event.eventDate,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          coordinator: event.facilitatorName || 'Koordinator Volunteer',
          responsibilities:
            event.description ||
            'Pendampingan kegiatan, registrasi peserta, dan dokumentasi.',
          approval: 'approved',
          phase: isUpcoming ? 'upcoming' : 'past',
        };
      });
      setAssignments(mapped);
    } else {
      setAssignments([]);
    }

    if (shiftsRes.status === 'fulfilled') {
      const shiftRows = shiftsRes.value.data ?? [];
      const mappedAttendance: VolunteerAttendanceRecord[] = shiftRows.map(
        (shift) => ({
          id: shift.id,
          title:
            shift.taskSummary ||
            `${shift.shiftType.replace('_', ' ')} (${shift.location})`,
          scannedAt: shift.clockInAt,
          personRole: 'volunteer',
        })
      );
      setAttendance(mappedAttendance);
    } else {
      setAttendance([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const upcomingAssignments = assignments.filter(
    (item) => item.phase === 'upcoming'
  );
  const pastAssignments = assignments.filter((item) => item.phase === 'past');

  return {
    assignments,
    upcomingAssignments,
    pastAssignments,
    attendance,
    loading,
    reload: load,
  };
}
