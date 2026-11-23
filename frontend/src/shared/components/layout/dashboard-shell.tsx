'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Home, LogOut, type LucideIcon } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Logo } from '@/shared/components/ui/logo';
import { DashboardBottomNav } from '@/shared/components/layout/dashboard-bottom-nav';

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardShellUser {
  name: string;
  role: string;
}

interface DashboardShellProps {
  items: DashboardNavItem[];
  mobileNav?: DashboardNavItem[];
  brandHref: string;
  titleFallback: string;
  roleLabel: string;
  user?: DashboardShellUser | null;
  onLogout?: () => void;
  notificationSlot?: ReactNode;
  profileHref: string;
  profileLabel?: string;
  footerText: string;
  guestAction?: boolean;
  children: ReactNode;
}

function findActiveTitle(
  pathname: string,
  items: DashboardNavItem[],
  brandHref: string,
  fallback: string
): string {
  const match = [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== brandHref && pathname.startsWith(`${item.href}/`))
    );
  return match?.label ?? fallback;
}

function DashboardSidebarNav({
  items,
  brandHref,
  collapsed,
}: {
  items: DashboardNavItem[];
  brandHref: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      aria-label="Navigasi utama"
    >
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== brandHref && pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
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

export function DashboardShell({
  items,
  mobileNav,
  brandHref,
  titleFallback,
  roleLabel,
  user = null,
  onLogout,
  notificationSlot,
  profileHref,
  profileLabel = 'Profil Saya',
  footerText,
  guestAction = false,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const displayName = user?.name ?? 'Pengguna';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh">
      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-surface-soft bg-white transition-all duration-200 lg:flex lg:shadow-none ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        <div className="flex items-center justify-between pr-2">
          <div
            className={`flex h-16 shrink-0 items-center border-b border-surface-soft px-4 pb-1 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Link href={brandHref} className="flex items-center">
              <Logo size={36} showName={!collapsed} />
            </Link>
          </div>
        </div>

        <DashboardSidebarNav
          items={items}
          brandHref={brandHref}
          collapsed={collapsed}
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
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            title="Kembali ke Beranda"
            className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-field border border-surface-soft px-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-primary/30 hover:bg-surface-blue hover:text-primary-deep focus-visible:ring-2 focus-visible:ring-primary/40 lg:h-9 lg:min-w-0 lg:px-3"
          >
            <Home className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">Beranda</span>
          </Link>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-primary-deep lg:text-lg">
            {findActiveTitle(pathname, items, brandHref, titleFallback)}
          </h1>

          {user ? notificationSlot : null}

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
                      {roleLabel}
                    </Badge>
                  </div>
                  <Link
                    role="menuitem"
                    href={profileHref}
                    onClick={() => setUserMenuOpen(false)}
                    className="mt-1 block rounded-field px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-blue"
                  >
                    {profileLabel}
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout?.();
                    }}
                    className="flex w-full items-center gap-2 rounded-field px-3 py-2 text-left text-sm font-semibold text-danger transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          ) : guestAction ? (
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="rounded-field bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              Masuk
            </Link>
          ) : null}
        </header>

        <main className="w-full flex-1 px-4 pt-6 pb-24 lg:px-8 lg:pb-6">
          {children}
        </main>

        <footer className="border-t border-surface-soft px-4 pt-4 pb-20 text-center text-xs text-ink-soft lg:px-6 lg:py-4">
          {footerText}
        </footer>
      </div>

      <DashboardBottomNav
        items={items}
        brandHref={brandHref}
        mobileNav={mobileNav}
      />
    </div>
  );
}
