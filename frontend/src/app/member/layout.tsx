import type { ReactNode } from 'react';
import { ToastProvider } from '@/shared/components/ui/toast';
import { MemberShell } from '@/features/members';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <MemberShell>{children}</MemberShell>
    </ToastProvider>
  );
}
