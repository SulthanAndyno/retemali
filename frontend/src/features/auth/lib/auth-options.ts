import type { AccessMode } from '../types';

export interface AccessModeOption {
  key: AccessMode;
  label: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
}

export const ACCESS_MODES: readonly AccessModeOption[] = [
  {
    key: 'NON_MEMBER',
    label: 'Non-Member',
    desc: 'Tanpa akun — jelajahi katalog, kegiatan, dan donasi.',
  },
  {
    key: 'MEMBER',
    label: 'Member',
    desc: 'Akses peminjaman, kegiatan, QR absensi, dan profil.',
  },
  {
    key: 'VOLUNTEER',
    label: 'Volunteer',
    desc: 'Dashboard relawan: jadwal, tugas, dan absensi.',
    badge: 'Perlu persetujuan admin',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'ADMIN',
    label: 'Admin',
    desc: 'Kendali operasional pustaka & manajemen.',
    badge: 'Terbatas',
    badgeColor: 'bg-red-100 text-red-600',
  },
];

export const LOGIN_FEATURES: readonly string[] = [
  'Katalog buku dapat dicari dan disaring',
  'Kegiatan gratis maupun berbayar',
  'Donasi finansial & buku fisik',
  'Dashboard member, relawan, & admin',
];

export const PUBLIC_BENEFITS: readonly string[] = [
  'Jelajahi seluruh katalog buku perpustakaan',
  'Lihat jadwal kegiatan komunitas',
  'Berikan donasi buku atau finansial',
  'Temukan info lokasi & jam buka',
];

export function getAccessModeLabel(mode: AccessMode | null): string {
  if (!mode) return '';
  return ACCESS_MODES.find((option) => option.key === mode)?.label ?? '';
}
