import {
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Home,
  Images,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface PublicNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const publicNav: PublicNavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Katalog Buku', href: '/katalog', icon: BookOpen },
  { label: 'Kegiatan Komunitas', href: '/kegiatan', icon: CalendarDays },
  { label: 'Dokumentasi Kegiatan', href: '/dokumentasi', icon: Images },
  { label: 'Donasi', href: '/donasi', icon: HeartHandshake },
];

export const publicMobileNav: PublicNavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Katalog', href: '/katalog', icon: BookOpen },
  { label: 'Kegiatan', href: '/kegiatan', icon: CalendarDays },
  { label: 'Dokumentasi', href: '/dokumentasi', icon: Images },
  { label: 'Donasi', href: '/donasi', icon: HeartHandshake },
  { label: 'Portal', href: '/portal', icon: User },
];
