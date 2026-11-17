import type { ReactNode } from 'react';
import { ToastProvider } from '@/shared/components/ui/toast';
import { VolunteerShell } from '@/features/volunteers';

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <VolunteerShell>{children}</VolunteerShell>
    </ToastProvider>
  );
}
