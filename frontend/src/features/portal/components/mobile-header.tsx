'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowLeftRight, LogIn, Menu } from 'lucide-react';
import Image from 'next/image';
import { useAuth, useRole } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';
import { getImageUrl } from '@/shared/lib/utils';
import { PortalDrawer } from './portal-drawer';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

type RoleToast = { message: string; type: 'success' | 'error' } | null;

export function MobileHeader({
  title,
  subtitle,
  showBack = false,
}: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    activeRole,
    isVolunteerMode,
    canSwitchVolunteer,
    switching,
    switchRole,
  } = useRole();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [memberNotice, setMemberNotice] = useState(false);
  const [roleToast, setRoleToast] = useState<RoleToast>(null);

  const handleMemberClick = () => {
    setMemberNotice(true);
    window.setTimeout(() => setMemberNotice(false), 3000);
  };

  const handleToggleVolunteer = async () => {
    try {
      const result = await switchRole(
        isVolunteerMode ? 'MEMBER' : 'VOLUNTEER'
      );
      setRoleToast({
        message: result?.note ?? 'Mode peran berhasil diubah.',
        type: 'success',
      });
    } catch (error) {
      setRoleToast({
        message:
          error instanceof Error ? error.message : 'Gagal mengganti peran.',
        type: 'error',
      });
    } finally {
      window.setTimeout(() => setRoleToast(null), 3500);
    }
  };

  return (
    <>
      {memberNotice ? (
        <div className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
          <span>
            Dashboard Member sedang dalam tahap pengembangan (On Progress).
          </span>
        </div>
      ) : null}

      {roleToast ? (
        <div
          className={`fixed left-1/2 top-16 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-lg ${
            roleToast.type === 'success' ? 'bg-teal-700' : 'bg-rose-600'
          }`}
        >
          <ArrowLeftRight size={14} />
          <span>{roleToast.message}</span>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 bg-white shadow-xs">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
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
                  <h1 className="max-w-[170px] truncate text-sm font-bold leading-tight text-slate-900">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="max-w-[170px] truncate text-[10px] leading-tight text-slate-500">
                      {subtitle}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <h1 className="text-sm font-extrabold leading-tight tracking-wide text-blue-700">
                    Rete Mali
                  </h1>
                  <p className="text-[10px] leading-tight text-slate-500">
                    Taman Baca &amp; Komunitas
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        activeRole={activeRole}
        isVolunteerMode={isVolunteerMode}
        canSwitchVolunteer={canSwitchVolunteer}
        roleSwitching={switching}
        onClose={() => setDrawerOpen(false)}
        onMemberClick={handleMemberClick}
        onToggleVolunteer={() => void handleToggleVolunteer()}
        onLogout={logout}
      />
    </>
  );
}
