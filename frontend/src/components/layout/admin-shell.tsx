'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from './dashboard-shell';
import { adminNav } from '@/features/admin/shell/admin-nav';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      items={adminNav}
      brandHref="/admin"
      titleFallback="Dashboard Admin"
      roleLabel="Administrator"
      profileHref="/admin/akun"
      profileLabel="Pengaturan Akun"
      footerText="Taman Baca ReteMali — Konsol Administrator"
    >
      {children}
    </DashboardShell>
  );
}
