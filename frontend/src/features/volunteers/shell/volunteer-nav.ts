import {
  CalendarClock,
  CalendarDays,
  ClipboardList,
  HeartHandshake,
  History,
  LayoutDashboard,
  QrCode,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface VolunteerNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const volunteerNav: VolunteerNavItem[] = [
  { label: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { label: 'Kegiatan Saya', href: '/volunteer/kegiatan', icon: CalendarDays },
  { label: 'Jadwal dan Tugas', href: '/volunteer/jadwal', icon: CalendarClock },
  { label: 'QR Absensi', href: '/volunteer/qr-absensi', icon: QrCode },
  { label: 'Riwayat Kehadiran', href: '/volunteer/kehadiran', icon: History },
  { label: 'Notifikasi', href: '/volunteer/notifikasi', icon: ClipboardList },
  { label: 'Profil Saya', href: '/volunteer/profil', icon: User },
  { label: 'Operasional', href: '/volunteer/operasional', icon: HeartHandshake },
];

export const volunteerMobileNav: VolunteerNavItem[] = [
  { label: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { label: 'Kegiatan', href: '/volunteer/kegiatan', icon: CalendarDays },
  { label: 'Jadwal', href: '/volunteer/jadwal', icon: CalendarClock },
  { label: 'QR Absensi', href: '/volunteer/qr-absensi', icon: QrCode },
];
