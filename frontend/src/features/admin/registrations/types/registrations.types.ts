export interface AdminRegistrationRow {
  id: string;
  ticketCode: string;
  status: string;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | null;
  paymentNote: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    ticketPrice: string | number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    memberCode: string;
  };
}

export interface AdminEventOption {
  id: string;
  title: string;
}
