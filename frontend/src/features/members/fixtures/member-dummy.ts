import type {
  MemberAttendanceRecord,
  MemberQrToken,
} from '../types/member-page.types';

export const MEMBER_ATTENDANCE: MemberAttendanceRecord[] = [
  {
    id: 'm-att-001',
    title: 'Kelas Mendongeng Anak',
    scannedAt: '2026-11-09T09:06:00+07:00',
  },
  {
    id: 'm-att-002',
    title: 'Festival Literasi Warga',
    scannedAt: '2026-09-20T09:12:00+07:00',
  },
  {
    id: 'm-att-003',
    title: 'Klub Buku Remaja',
    scannedAt: '2026-08-16T14:04:00+07:00',
  },
];

export const MEMBER_QR_TOKENS: MemberQrToken[] = [
  {
    token: 'QR-MEMBER-2026-001',
    active: false,
    expiresAt: '2026-11-22T11:00:00+07:00',
  },
];
