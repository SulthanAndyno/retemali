'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { useAuth } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { memberMobileNav, memberNav } from './member-nav';

export function MemberShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <DashboardShell
      items={memberNav}
      mobileNav={memberMobileNav}
      brandHref="/member"
      titleFallback="Dashboard Member"
      roleLabel="Member ReteMali"
      user={user ? { name: user.name, role: user.role } : null}
      onLogout={logout}
      notificationSlot={<NotificationBell />}
      profileHref="/member/profil"
      footerText="Taman Baca ReteMali — Portal Anggota"
    >
      {children}
    </DashboardShell>
  );
}
