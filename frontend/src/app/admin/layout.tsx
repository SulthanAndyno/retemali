import type { ReactNode } from 'react';
import { AdminShell } from '@/features/admin';
import { ToastProvider } from '@/shared/components/ui/toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
