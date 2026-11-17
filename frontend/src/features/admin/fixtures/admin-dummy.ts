export type DummyMembershipStatus = 'active' | 'pending' | 'expired';

export interface DummyMember {
  id: string;
  memberNo: string;
  fullName: string;
  email: string;
  phone: string;
  membershipStatus: DummyMembershipStatus;
}

export interface DummyPayment {
  id: string;
  subject: 'activity_registration' | 'donation';
  description: string;
  amount: number;
  method: 'qris' | 'bank_transfer';
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface DummyDonation {
  id: string;
  reference: string;
  type: 'financial' | 'physical';
  donorName: string;
  status: string;
  amount?: number;
  bookCount?: number;
}

export interface DummyApprovedVolunteer {
  id: string;
  fullName: string;
  email: string;
  status: 'approved' | 'pending';
}

export interface DummySiteSettings {
  address: string;
  mapsUrl: string;
  instagramUrl: string;
  phone: string;
  email: string;
  donationInstructions: string;
}

export interface DummyQrToken {
  activityId: string;
  token: string;
  active: boolean;
  expiresAt: string;
}

export interface DummyBroadcast {
  id: string;
  title: string;
  target: 'all' | 'member' | 'volunteer';
  createdAt: string;
}

export const DUMMY_MEMBERS: DummyMember[] = [
  {
    id: 'dummy-member-1',
    memberNo: 'RM-2026-001',
    fullName: 'Contoh Anggota Satu',
    email: 'anggota.satu@example.test',
    phone: '080000000001',
    membershipStatus: 'active',
  },
  {
    id: 'dummy-member-2',
    memberNo: 'RM-2026-002',
    fullName: 'Contoh Anggota Dua',
    email: 'anggota.dua@example.test',
    phone: '080000000002',
    membershipStatus: 'pending',
  },
  {
    id: 'dummy-member-3',
    memberNo: 'RM-2026-003',
    fullName: 'Contoh Anggota Tiga',
    email: 'anggota.tiga@example.test',
    phone: '080000000003',
    membershipStatus: 'expired',
  },
];

export const DUMMY_PENDING_PAYMENTS: DummyPayment[] = [
  {
    id: 'dummy-payment-1',
    subject: 'activity_registration',
    description: 'Pendaftaran kegiatan contoh',
    amount: 35000,
    method: 'qris',
    status: 'pending',
    createdAt: '2026-11-17T03:00:00.000Z',
  },
  {
    id: 'dummy-payment-2',
    subject: 'donation',
    description: 'Donasi finansial contoh',
    amount: 100000,
    method: 'bank_transfer',
    status: 'pending',
    createdAt: '2026-11-16T09:30:00.000Z',
  },
];

export const DUMMY_DONATIONS: DummyDonation[] = [
  {
    id: 'dummy-donation-1',
    reference: 'INV-RM-2026-9999',
    type: 'financial',
    donorName: 'Donatur Contoh',
    status: 'pending',
    amount: 100000,
  },
  {
    id: 'dummy-donation-2',
    reference: 'BDN-2026-9999',
    type: 'physical',
    donorName: 'Donatur Buku Contoh',
    status: 'pending',
    bookCount: 5,
  },
];

export const DUMMY_APPROVED_VOLUNTEERS: DummyApprovedVolunteer[] = [
  {
    id: 'dummy-volunteer-1',
    fullName: 'Relawan Contoh Satu',
    email: 'relawan.satu@example.test',
    status: 'approved',
  },
  {
    id: 'dummy-volunteer-2',
    fullName: 'Relawan Contoh Dua',
    email: 'relawan.dua@example.test',
    status: 'pending',
  },
];

export const DUMMY_SITE_SETTINGS: DummySiteSettings = {
  address: 'Alamat contoh — belum diatur di backend',
  mapsUrl: 'https://maps.example.test',
  instagramUrl: 'https://instagram.example.test',
  phone: '080000000000',
  email: 'admin@example.test',
  donationInstructions: 'Instruksi donasi contoh — endpoint pengaturan belum tersedia.',
};

export const DUMMY_QR_TOKENS: DummyQrToken[] = [
  {
    activityId: 'dummy-activity-1',
    token: 'DUMMY-QR-TOKEN',
    active: true,
    expiresAt: '2026-11-17T10:00:00.000Z',
  },
];

export const DUMMY_BROADCASTS: DummyBroadcast[] = [
  {
    id: 'dummy-broadcast-1',
    title: 'Contoh pengumuman admin',
    target: 'all',
    createdAt: '2026-11-17T02:00:00.000Z',
  },
];
