export interface AdminVolunteerApplication {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  majorOrJob: string;
  institution: string;
  division: string;
  motivation: string;
  cvDocument: string | null;
  rejectionNote: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
