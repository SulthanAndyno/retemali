import {
  BookMarked,
  CalendarDays,
  HeartHandshake,
  LayoutDashboard,
  Settings,
  User,
  BellRing,
  type LucideIcon,
} from 'lucide-react';

export interface MemberNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const memberNav: MemberNavItem[] = [
  { label: 'Dashboard', href: '/member', icon: LayoutDashboard },
  { label: 'Peminjaman Saya', href: '/member/peminjaman', icon: BookMarked },
  { label: 'Kegiatan Saya', href: '/member/kegiatan', icon: CalendarDays },
  { label: 'Notifikasi', href: '/member/notifikasi', icon: BellRing },
  { label: 'Profil Saya', href: '/member/profil', icon: User },
  { label: 'Pengaturan Akun', href: '/member/pengaturan', icon: Settings },
  { label: 'Layanan', href: '/member/layanan', icon: HeartHandshake },
];

export const memberMobileNav: MemberNavItem[] = [
  { label: 'Dashboard', href: '/member', icon: LayoutDashboard },
  { label: 'Peminjaman', href: '/member/peminjaman', icon: BookMarked },
  { label: 'Kegiatan', href: '/member/kegiatan', icon: CalendarDays },
  { label: 'Profil', href: '/member/profil', icon: User },
];
