'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { volunteerNav } from './volunteer-nav';

export function VolunteerShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      items={volunteerNav}
      brandHref="/volunteer"
      titleFallback="Dashboard Relawan"
      roleLabel="Relawan Terverifikasi"
      profileHref="/volunteer/profil"
      footerText="Taman Baca ReteMali — ReteMali Web App"
    >
      {children}
    </DashboardShell>
  );
}
