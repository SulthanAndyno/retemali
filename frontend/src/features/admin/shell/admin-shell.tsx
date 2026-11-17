'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { useAuth } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { adminMobileNav, adminNav } from './admin-nav';

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <DashboardShell
      items={adminNav}
      mobileNav={adminMobileNav}
      brandHref="/admin"
      titleFallback="Dashboard Admin"
      roleLabel="Administrator"
      user={user ? { name: user.name, role: user.role } : null}
      onLogout={logout}
      notificationSlot={<NotificationBell />}
      profileHref="/admin/akun"
      profileLabel="Pengaturan Akun"
      footerText="Taman Baca ReteMali — Konsol Administrator"
    >
      {children}
    </DashboardShell>
  );
}
