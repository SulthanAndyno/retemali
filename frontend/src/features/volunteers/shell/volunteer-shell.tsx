'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import NotificationBell from '@/components/layout/NotificationBell';
import { useAuth } from '@/features/auth';
import { volunteerNav, type VolunteerNavItem } from './volunteer-nav';

interface VolunteerShellProps {
  children: ReactNode;
}

function activeTitle(pathname: string): string {
  const match = [...volunteerNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== '/volunteer' && pathname.startsWith(`${item.href}/`))
    );
  return match?.label ?? 'Dashboard Relawan';
}

function VolunteerSidebarNav({
  items,
  collapsed,
  onNavigate,
}: {
  items: VolunteerNavItem[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      aria-label="Navigasi relawan"
    >
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/volunteer' && pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            title={item.label}
            className={`flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 ${
              active
                ? 'bg-primary text-white'
                : 'text-ink hover:bg-surface-blue hover:text-primary-deep'
            } ${collapsed ? 'justify-center lg:px-0' : ''}`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className={`${collapsed ? 'lg:hidden' : ''} truncate`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function VolunteerShell({ children }: VolunteerShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  const displayName = user?.name ?? 'Relawan';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh">
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        aria-label="Sidebar relawan"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-surface-soft bg-white shadow-drawer transition-all duration-200 lg:translate-x-0 lg:shadow-none ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between pr-2">
          <div
            className={`flex h-16 shrink-0 items-center border-b border-surface-soft px-4 pb-1 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Link href="/volunteer" title="Dashboard Relawan" className="flex items-center">
              <Logo size={36} showName={!collapsed} />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu navigasi"
            className="rounded-field p-2 text-ink transition-colors hover:bg-surface-blue lg:hidden"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <VolunteerSidebarNav
          items={volunteerNav}
          collapsed={collapsed}
          onNavigate={() => setOpen(false)}
        />

        <div
          className={`hidden shrink-0 items-center border-t border-surface-soft p-3 lg:flex ${
            collapsed ? 'justify-center' : 'justify-start px-4'
          }`}
        >
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-field px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-blue hover:text-primary-deep lg:block"
            aria-label={collapsed ? 'Perluas sidebar' : 'Ringkas sidebar'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>
      </aside>

      <div
        className={`flex min-h-dvh flex-col transition-[padding] duration-200 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
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

          {user ? <NotificationBell /> : null}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-full p-1.5 transition-colors hover:bg-surface-blue"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {initial}
                </span>
                <ChevronDown className="h-4 w-4 text-ink-soft" aria-hidden />
                <span className="sr-only">Menu akun</span>
              </button>

              {userMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-2 w-64 rounded-card border border-surface-soft bg-white p-2 shadow-pop"
                >
                  <div className="border-b border-surface-soft px-3 pb-2 pt-1.5">
                    <p className="truncate text-sm font-bold text-ink">
                      {displayName}
                    </p>
                    <Badge tone="info" className="mt-1">
                      Relawan Terverifikasi
                    </Badge>
                  </div>
                  <Link
                    role="menuitem"
                    href="/volunteer/profil"
                    onClick={() => setUserMenuOpen(false)}
                    className="mt-1 block rounded-field px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-blue"
                  >
                    Profil Saya
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-field px-3 py-2 text-left text-sm font-semibold text-danger transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-surface-soft px-4 py-4 text-center text-xs text-ink-soft lg:px-6">
          Taman Baca ReteMali — ReteMali Web App
        </footer>
      </div>
    </div>
  );
}
