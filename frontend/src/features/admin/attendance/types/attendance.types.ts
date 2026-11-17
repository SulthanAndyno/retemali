export interface AdminAttendanceParticipant {
  registrationId: string;
  ticketCode: string;
  user?: {
    name?: string;
    memberCode?: string;
    phone?: string | null;
  } | null;
  status: string;
  checkedInAt: string | null;
  paymentStatus: string | null;
}

export interface AdminAttendanceEvent {
  id: string;
  title: string;
  eventDate: string;
  quota: number;
  registeredCount: number;
  attendedCount: number;
  participants?: AdminAttendanceParticipant[];
}
