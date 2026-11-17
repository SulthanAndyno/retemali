'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarBrand, SidebarNav } from '@/components/layout/sidebar-nav';
import { adminNav } from '@/features/admin/shell/admin-nav';

interface AdminShellProps {
  children: ReactNode;
}

function activeTitle(pathname: string): string {
  const match = [...adminNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
    );
  return match?.label ?? 'Dashboard Admin';
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="bg-surface text-ink">
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:py-6">
        <aside
          aria-label="Sidebar admin"
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-surface-soft bg-white shadow-drawer transition-transform duration-200 lg:sticky lg:inset-y-auto lg:left-auto lg:top-6 lg:z-0 lg:h-[calc(100dvh-3rem)] lg:w-auto lg:translate-x-0 lg:rounded-card lg:border lg:shadow-card ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pr-2">
            <SidebarBrand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu navigasi"
              className="rounded-field p-2 text-ink transition-colors hover:bg-surface-blue lg:hidden"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <SidebarNav items={adminNav} onNavigate={() => setOpen(false)} />
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-surface-soft bg-white/90 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu navigasi"
            className="rounded-field p-2 text-ink transition-colors hover:bg-surface-blue lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-primary-deep lg:text-lg">
            {activeTitle(pathname)}
          </h1>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-ink">{user?.name ?? 'Administrator'}</p>
              <p className="text-xs text-ink-soft">Administrator</p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Keluar"
              className="rounded-field p-2 text-danger transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </header>

          <main className="w-full flex-1 px-4 py-6 lg:px-0">{children}</main>

          <footer className="border-t border-surface-soft px-4 py-4 text-center text-xs text-ink-soft lg:px-0">
            Taman Baca ReteMali — Konsol Administrator
          </footer>
        </div>
      </div>
    </div>
  );
}
