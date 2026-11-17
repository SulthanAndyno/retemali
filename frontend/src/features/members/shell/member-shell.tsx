'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { memberNav } from './member-nav';

export function MemberShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      items={memberNav}
      brandHref="/member"
      titleFallback="Dashboard Member"
      roleLabel="Member ReteMali"
      profileHref="/member/profil"
      footerText="Taman Baca ReteMali — Portal Anggota"
    >
      {children}
    </DashboardShell>
  );
}
