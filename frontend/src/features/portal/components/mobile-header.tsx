'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, LogIn, Menu } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { getImageUrl } from '@/shared/lib/utils';
import { PortalDrawer } from './portal-drawer';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export function MobileHeader({
  title,
  subtitle,
  showBack = false,
}: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-blue-100/80 bg-white shadow-xs">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3 sm:max-w-2xl md:max-w-4xl md:px-6 lg:max-w-6xl lg:px-8 xl:max-w-7xl">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawerOpen(true)}
              className="-ml-1 rounded-lg p-1 text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
              aria-label="Buka Menu Samping"
              title="Menu Navigasi"
            >
              <Menu size={22} />
            </button>

            {showBack ? (
              <button
                onClick={() => router.back()}
                className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Kembali"
              >
                <ArrowLeft size={20} />
              </button>
            ) : null}

            <div>
              {title ? (
                <>
                  <h1 className="max-w-[170px] truncate text-sm font-bold leading-tight text-slate-900 md:max-w-none md:text-base">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="max-w-[170px] truncate text-[10px] leading-tight text-slate-500 md:max-w-none md:text-xs">
                      {subtitle}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <h1 className="text-sm font-extrabold leading-tight tracking-wide text-blue-700 md:text-base">
                    Rete Mali
                  </h1>
                  <p className="text-[10px] leading-tight text-slate-500 md:text-xs">
                    Taman Baca &amp; Komunitas
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Kembali ke beranda"
              title="Kembali ke Beranda"
              className="flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-2.5 text-[11px] font-bold text-blue-700 shadow-xs transition-colors hover:bg-blue-50 sm:h-9 sm:min-w-0"
            >
              <Home size={15} />
              <span className="hidden sm:inline">Beranda</span>
            </Link>

            {user ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => router.push('/portal')}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-blue-100 text-xs font-bold text-blue-700"
                  aria-label="Profil"
                >
                  {user.avatar ? (
                    <Image
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'RM'}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
              >
                <span>Masuk</span>
                <LogIn size={13} />
              </button>
            )}
          </div>
        </div>
      </header>

      <PortalDrawer
        open={drawerOpen}
        user={user}
        onClose={() => setDrawerOpen(false)}
        onMemberClick={() => {
          setDrawerOpen(false);
          router.push('/member');
        }}
        onLogout={logout}
      />
    </>
  );
}
