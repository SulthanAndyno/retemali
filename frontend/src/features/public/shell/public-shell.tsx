'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { useAuth, type User } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { publicMobileNav, publicNav } from './public-nav';

function publicRoleLabel(role: User['role']): string {
  if (role === 'ADMIN') return 'Administrator';
  if (role === 'VOLUNTEER') return 'Volunteer Terverifikasi';
  return 'Member ReteMali';
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <DashboardShell
      items={publicNav}
      mobileNav={publicMobileNav}
      brandHref="/"
      titleFallback="ReteMali"
      roleLabel={user ? publicRoleLabel(user.role) : 'Pengunjung'}
      user={user ? { name: user.name, role: user.role } : null}
      onLogout={logout}
      notificationSlot={<NotificationBell />}
      profileHref="/portal"
      profileLabel="Portal Saya"
      footerText="Taman Baca ReteMali — ReteMali Web App"
      guestAction
    >
      {children}
    </DashboardShell>
  );
}
