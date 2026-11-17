'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import type { User } from '@/features/auth';
import { publicNav } from './public-nav';

function publicRoleLabel(role: User['role']): string {
  if (role === 'ADMIN') return 'Administrator';
  if (role === 'VOLUNTEER') return 'Relawan Terverifikasi';
  return 'Member ReteMali';
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      items={publicNav}
      brandHref="/"
      titleFallback="ReteMali"
      roleLabel={publicRoleLabel}
      profileHref="/portal"
      profileLabel="Portal Saya"
      footerText="Taman Baca ReteMali — ReteMali Web App"
      guestAction
    >
      {children}
    </DashboardShell>
  );
}
