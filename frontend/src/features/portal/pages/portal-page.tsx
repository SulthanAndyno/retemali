'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { MobileHeader } from '../components/mobile-header';
import { BottomNav } from '../components/bottom-nav';
import { PortalProfileCard } from '../components/portal-profile-card';
import { PortalAccessSection } from '../components/portal-access-section';
import { PortalQuickLinks } from '../components/portal-quick-links';
import { PortalGuestPanel } from '../components/portal-guest-panel';
import { useAuth } from '@/features/auth';

export function PortalPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh w-full bg-blue-50/50 pb-24 text-slate-800 lg:pb-10">
      <MobileHeader title="Portal Peran" subtitle="Pusat Navigasi & Akun" />

      <main className="mx-auto w-full max-w-md space-y-4 px-4 pt-3 sm:max-w-2xl md:grid md:max-w-4xl md:grid-cols-2 md:gap-4 md:space-y-0 md:px-6 md:pt-5 lg:max-w-6xl lg:grid-cols-3 lg:gap-5 lg:px-8 lg:pt-6 xl:max-w-7xl">
        {user ? (
          <>
            <div className="md:col-span-1 lg:col-start-1 lg:row-start-1">
              <PortalProfileCard user={user} />
            </div>
            <div className="md:col-span-1 lg:col-span-2 lg:col-start-2 lg:row-start-1">
              <PortalAccessSection
                role={user.role}
                onAdmin={() => router.push('/admin')}
                onOperations={() => router.push('/volunteer/operasional')}
                onMember={() => router.push('/member')}
              />
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-3 text-xs font-bold text-rose-600 shadow-xs transition-colors hover:bg-rose-50 md:col-span-2 md:mx-auto md:max-w-sm lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:max-w-none lg:self-start"
            >
              <LogOut size={16} />
              <span>Keluar dari Akun</span>
            </button>
            <div className="hidden md:col-span-2 md:block lg:col-span-2 lg:col-start-2 lg:row-start-2">
              <PortalQuickLinks
                onCatalog={() => router.push('/katalog')}
                onEvents={() => router.push('/kegiatan')}
                onDonate={() => router.push('/donasi')}
              />
            </div>
          </>
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <PortalGuestPanel
              onLogin={() => router.push('/login')}
              onRegister={() => router.push('/login/daftar')}
              onCatalog={() => router.push('/katalog')}
              onEvents={() => router.push('/kegiatan')}
              onDonate={() => router.push('/donasi')}
            />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
