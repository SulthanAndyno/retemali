'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ellipsis, X } from 'lucide-react';
import type { DashboardNavItem } from './dashboard-shell';

interface DashboardBottomNavProps {
  items: DashboardNavItem[];
  brandHref: string;
  mobileNav?: DashboardNavItem[];
}

function isActivePath(pathname: string, href: string, brandHref: string): boolean {
  if (href === brandHref) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardBottomNav({
  items,
  brandHref,
  mobileNav,
}: DashboardBottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const base = mobileNav ?? items.slice(0, 4);
  const moreCandidates = items.filter(
    (item) => !base.some((mobileItem) => mobileItem.href === item.href)
  );
  const primary =
    moreCandidates.length > 0 ? base.slice(0, 4) : base.slice(0, 5);
  const more = moreCandidates;
  const moreActive = more.some((item) =>
    isActivePath(pathname, item.href, brandHref)
  );

  useEffect(() => {
    document.documentElement.style.overflow = moreOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [moreOpen]);

  return (
    <>
      {moreOpen ? (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden
        />
      ) : null}

      {moreOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu lainnya"
          className="fixed inset-x-0 bottom-0 z-[60] rounded-t-card border-t border-surface-soft bg-white p-4 pb-safe shadow-pop lg:hidden"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-primary-deep">
              Menu Lainnya
            </h2>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Tutup menu lainnya"
              className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface-blue hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="grid max-h-[60dvh] grid-cols-2 gap-2 overflow-y-auto">
            {more.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href, brandHref);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-field px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-surface text-ink hover:bg-surface-blue'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="min-w-0 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-soft bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.08)] lg:hidden"
      >
        <div className="flex items-center justify-around px-2">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href, brandHref);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="nav-link flex-1 pt-2 pb-safe"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-blue-600' : 'text-gray-400'}
                  aria-hidden
                />
                <span
                  className={
                    active
                      ? 'font-semibold text-blue-600'
                      : 'text-gray-500'
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {more.length > 0 ? (
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              aria-expanded={moreOpen}
              aria-label="Buka menu lainnya"
              className="nav-link flex-1 pt-2 pb-safe"
            >
              <Ellipsis
                size={22}
                strokeWidth={moreOpen || moreActive ? 2.5 : 1.8}
                className={
                  moreOpen || moreActive ? 'text-blue-600' : 'text-gray-400'
                }
                aria-hidden
              />
              <span
                className={
                  moreOpen || moreActive
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-500'
                }
              >
                Lainnya
              </span>
            </button>
          ) : null}
        </div>
      </nav>
    </>
  );
}
