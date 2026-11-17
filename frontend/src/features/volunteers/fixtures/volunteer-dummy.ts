import type {
  VolunteerAssignment,
  VolunteerAttendanceRecord,
  VolunteerQrToken,
} from '../types/volunteer-page.types';

export const VOLUNTEER_ASSIGNMENTS: VolunteerAssignment[] = [
  {
    id: 'va-dummy-001',
    eventId: null,
    title: 'Kelas Mendongeng Anak',
    eventDate: '2026-11-22T09:00:00+07:00',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Saung Baca Rete Mali, Jatirangga',
    coordinator: 'Kak Rina',
    responsibilities: 'Pendampingan anak, registrasi peserta, dan dokumentasi.',
    approval: 'approved',
    phase: 'upcoming',
  },
  {
    id: 'va-dummy-002',
    eventId: null,
    title: 'Klub Buku Remaja',
    eventDate: '2026-11-29T14:00:00+07:00',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Pendopo Terbuka Rete Mali',
    coordinator: 'Kak Dimas',
    responsibilities: 'Fasilitator diskusi dan penataan meja baca.',
    approval: 'approved',
    phase: 'upcoming',
  },
  {
    id: 'va-dummy-003',
    eventId: null,
    title: 'Kelas Sains Ceria',
    eventDate: '2026-11-08T13:00:00+07:00',
    startTime: '13:00',
    endTime: '15:00',
    location: 'Saung Baca Rete Mali, Jatirangga',
    coordinator: 'Kak Dimas',
    responsibilities: 'Pendampingan eksperimen dan pembagian alat peraga.',
    approval: 'approved',
    phase: 'past',
  },
  {
    id: 'va-dummy-004',
    eventId: null,
    title: 'Kerja Bakti Perpustakaan',
    eventDate: '2026-10-25T08:00:00+07:00',
    startTime: '08:00',
    endTime: '11:00',
    location: 'Rak Koleksi Sayap Barat',
    coordinator: 'Koordinator Relawan',
    responsibilities: 'Perapian rak, penyortiran buku, dan pembersihan area baca.',
    approval: 'approved',
    phase: 'past',
  },
];

export const VOLUNTEER_UPCOMING_ASSIGNMENTS = VOLUNTEER_ASSIGNMENTS.filter(
  (assignment) => assignment.phase === 'upcoming'
);

export const VOLUNTEER_PAST_ASSIGNMENTS = VOLUNTEER_ASSIGNMENTS.filter(
  (assignment) => assignment.phase === 'past'
);

export const VOLUNTEER_ATTENDANCE: VolunteerAttendanceRecord[] = [
  {
    id: 'att-dummy-001',
    title: 'Kelas Sains Ceria',
    scannedAt: '2026-11-08T13:05:00+07:00',
    personRole: 'volunteer',
  },
  {
    id: 'att-dummy-002',
    title: 'Kerja Bakti Perpustakaan',
    scannedAt: '2026-10-25T08:02:00+07:00',
    personRole: 'volunteer',
  },
  {
    id: 'att-dummy-003',
    title: 'Festival Literasi Warga',
    scannedAt: '2026-09-20T09:10:00+07:00',
    personRole: 'volunteer',
  },
];

export const VOLUNTEER_QR_TOKENS: VolunteerQrToken[] = [
  {
    token: 'QR-VOL-2026-001',
    active: false,
    expiresAt: '2026-11-22T11:00:00+07:00',
  },
];
