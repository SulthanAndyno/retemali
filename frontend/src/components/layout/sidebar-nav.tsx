'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import type { AdminNavItem } from '@/features/admin/shell/admin-nav';

interface SidebarNavProps {
  items: AdminNavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navigasi admin">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-primary text-white'
                : 'text-ink hover:bg-surface-blue hover:text-primary-deep'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-surface-soft px-4 pb-1">
      <Link href="/admin" title="Dashboard Admin" className="flex items-center">
        <Logo size={36} />
      </Link>
    </div>
  );
}
