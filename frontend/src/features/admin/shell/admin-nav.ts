import {
  BellRing,
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  QrCode,
  Receipt,
  Settings,
  Ticket,
  UserRoundCog,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Manajemen Buku', href: '/admin/buku', icon: BookOpen },
  { label: 'Manajemen Peminjaman', href: '/admin/peminjaman', icon: BookMarked },
  { label: 'Manajemen Member', href: '/admin/member', icon: Users },
  { label: 'Manajemen Kegiatan', href: '/admin/kegiatan', icon: CalendarDays },
  { label: 'Pendaftaran Kegiatan', href: '/admin/pendaftaran', icon: Ticket },
  { label: 'Verifikasi Pembayaran', href: '/admin/pembayaran', icon: Receipt },
  { label: 'Manajemen Donasi', href: '/admin/donasi', icon: HeartHandshake },
  { label: 'Manajemen Volunteer', href: '/admin/volunteer', icon: ClipboardList },
  { label: 'QR dan Absensi', href: '/admin/absensi', icon: QrCode },
  { label: 'Notifikasi', href: '/admin/notifikasi', icon: BellRing },
  { label: 'Laporan', href: '/admin/laporan', icon: FileText },
  { label: 'Pengaturan Website', href: '/admin/pengaturan', icon: Settings },
  { label: 'Pengaturan Akun', href: '/admin/akun', icon: UserRoundCog },
];
