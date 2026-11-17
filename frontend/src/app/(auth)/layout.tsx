import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="px-4 py-4 text-center text-xs text-ink-soft">
        Taman Baca ReteMali — ruang belajar, membaca, dan bertumbuh bersama.
      </footer>
    </div>
  );
}
