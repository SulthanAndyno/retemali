import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { PublicShell } from '@/features/public';

export default function NonMemberLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PublicShell>{children}</PublicShell>
    </ToastProvider>
  );
}
