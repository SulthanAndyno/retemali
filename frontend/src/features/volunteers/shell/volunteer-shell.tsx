'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { useAuth } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { volunteerMobileNav, volunteerNav } from './volunteer-nav';

export function VolunteerShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <DashboardShell
      items={volunteerNav}
      mobileNav={volunteerMobileNav}
      brandHref="/volunteer"
      titleFallback="Dashboard Volunteer"
      roleLabel="Volunteer Terverifikasi"
      user={user ? { name: user.name, role: user.role } : null}
      onLogout={logout}
      notificationSlot={<NotificationBell />}
      profileHref="/volunteer/profil"
      footerText="Taman Baca ReteMali — ReteMali Web App"
    >
      {children}
    </DashboardShell>
  );
}
