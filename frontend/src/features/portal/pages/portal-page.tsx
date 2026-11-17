'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeftRight, LogOut } from 'lucide-react';
import { MobileHeader } from '../components/mobile-header';
import { BottomNav } from '../components/bottom-nav';
import { PortalProfileCard } from '../components/portal-profile-card';
import { PortalAccessSection } from '../components/portal-access-section';
import { PortalRoleSwitch } from '../components/portal-role-switch';
import { PortalGuestPanel } from '../components/portal-guest-panel';
import { useAuth, useRole } from '@/features/auth';

type RoleToast = { message: string; type: 'success' | 'error' } | null;

export function PortalPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    activeRole,
    isVolunteerMode,
    canSwitchVolunteer,
    switching,
    switchRole,
  } = useRole();
  const [progressOpen, setProgressOpen] = useState(false);
  const [roleToast, setRoleToast] = useState<RoleToast>(null);

  const handleMemberClick = () => {
    setProgressOpen(true);
    window.setTimeout(() => setProgressOpen(false), 3000);
  };

  const handleToggleRole = async () => {
    try {
      const result = await switchRole(
        isVolunteerMode ? 'MEMBER' : 'VOLUNTEER'
      );
      setRoleToast({
        message: result?.note ?? 'Mode peran diperbarui.',
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
    <div className="mx-auto min-h-screen max-w-md bg-blue-50/50 pb-24 text-slate-800">
      {progressOpen ? (
        <div className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
          <AlertCircle size={15} />
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

      <MobileHeader title="Portal Peran" subtitle="Pusat Navigasi & Akun" />

      <main className="space-y-4 px-4 pt-3">
        {user ? (
          <>
            <PortalProfileCard user={user} />
            <PortalAccessSection
              role={user.role}
              onAdmin={() => router.push('/admin')}
              onOperations={() => router.push('/volunteer/operasional')}
              onMember={handleMemberClick}
            />
            {canSwitchVolunteer ? (
              <PortalRoleSwitch
                activeRole={activeRole}
                isVolunteerMode={isVolunteerMode}
                switching={switching}
                onToggle={() => void handleToggleRole()}
              />
            ) : null}
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-3 text-xs font-bold text-rose-600 shadow-xs transition-colors hover:bg-rose-50"
            >
              <LogOut size={16} />
              <span>Keluar dari Akun</span>
            </button>
          </>
        ) : (
          <PortalGuestPanel
            onLogin={() => router.push('/login')}
            onRegister={() => router.push('/login/daftar')}
            onCatalog={() => router.push('/katalog')}
            onEvents={() => router.push('/kegiatan')}
            onDonate={() => router.push('/donasi')}
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
