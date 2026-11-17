'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { memberMobileNav, memberNav } from './member-nav';

export function MemberShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      items={memberNav}
      mobileNav={memberMobileNav}
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
