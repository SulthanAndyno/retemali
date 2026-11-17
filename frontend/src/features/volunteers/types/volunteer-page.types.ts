export type VolunteerAssignmentPhase = 'upcoming' | 'past';

export interface VolunteerAssignment {
  id: string;
  eventId: string | null;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  coordinator: string;
  responsibilities: string;
  approval: 'approved';
  phase: VolunteerAssignmentPhase;
}

export interface VolunteerAttendanceRecord {
  id: string;
  title: string;
  scannedAt: string;
  personRole: 'volunteer';
}

export interface VolunteerQrToken {
  token: string;
  active: boolean;
  expiresAt: string;
}
