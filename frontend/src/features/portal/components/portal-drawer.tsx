'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  HeartHandshake,
  LogIn,
  LogOut,
  Shield,
  UserCheck,
  X,
} from 'lucide-react';
import type { ActiveRole, User } from '@/features/auth';

interface PortalDrawerProps {
  open: boolean;
  user: User | null;
  activeRole: ActiveRole;
  isVolunteerMode: boolean;
  canSwitchVolunteer: boolean;
  roleSwitching: boolean;
  onClose: () => void;
  onMemberClick: () => void;
  onToggleVolunteer: () => void;
  onLogout: () => void;
}

export function PortalDrawer({
  open,
  user,
  activeRole,
  isVolunteerMode,
  canSwitchVolunteer,
  roleSwitching,
  onClose,
  onMemberClick,
  onToggleVolunteer,
  onLogout,
}: PortalDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!open) return null;

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs">
      <div className="flex h-full w-4/5 max-w-xs flex-col justify-between bg-white p-5 shadow-2xl">
        <div className="max-h-[calc(100vh-140px)] space-y-5 overflow-y-auto pr-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-xs">
                RM
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Rete Mali
                </h3>
                <p className="text-[10px] text-slate-500">
                  Ruang Literasi Warga
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup menu"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Utama
            </p>
            {[
              { label: 'Beranda', href: '/', icon: BookOpen },
              { label: 'Katalog Buku', href: '/katalog', icon: BookOpen },
              {
                label: 'Kegiatan Komunitas',
                href: '/kegiatan',
                icon: Calendar,
              },
              { label: 'Donasi & Dukungan', href: '/donasi', icon: Heart },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-blue-50 font-bold text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon
                    size={16}
                    className={active ? 'text-blue-600' : 'text-slate-500'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {user ? (
            <div className="space-y-1 border-t border-slate-100 pt-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Portal Peran
                </p>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                  {user.role}
                </span>
              </div>

              {user.role === 'ADMIN' ? (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield size={16} className="text-indigo-600" />
                      <span>Dashboard Admin</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => navigate('/volunteer/operasional')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  >
                    <span className="flex items-center gap-2.5">
                      <HeartHandshake
                        size={16}
                        className="text-teal-600"
                      />
                      <span>Operasional Relawan</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>
                </>
              ) : null}

              {user.role === 'VOLUNTEER' ? (
                <button
                  onClick={() => navigate('/volunteer/operasional')}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                >
                  <span className="flex items-center gap-2.5">
                    <HeartHandshake size={16} className="text-teal-600" />
                    <span>Operasional Relawan</span>
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              ) : null}

              {user.role === 'MEMBER' || user.role === 'DONOR' ? (
                <button
                  onClick={onMemberClick}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-amber-50/80"
                >
                  <span className="flex items-center gap-2.5">
                    <UserCheck size={16} className="text-blue-600" />
                    <span>Dashboard Member</span>
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                    On Progress
                  </span>
                </button>
              ) : null}

              {canSwitchVolunteer ? (
                <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ArrowLeftRight
                        size={13}
                        className="text-blue-600"
                      />
                      <span className="text-[11px] font-bold text-slate-800">
                        Mode Peran Aktif
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        isVolunteerMode
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {activeRole}
                    </span>
                  </div>
                  <button
                    onClick={onToggleVolunteer}
                    disabled={roleSwitching}
                    className="w-full rounded-lg border border-teal-300 bg-white py-2 text-[11px] font-bold text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-60"
                  >
                    {roleSwitching
                      ? 'Mengalihkan...'
                      : isVolunteerMode
                        ? 'Keluar dari Mode Relawan'
                        : 'Masuk Mode Relawan'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-3 text-xs">
            <div className="mb-1 flex items-center gap-2 font-bold text-blue-700">
              <Clock size={15} />
              <span>Jam Buka Komunitas</span>
            </div>
            <p className="text-[11px] text-slate-600">Selasa – Minggu</p>
            <p className="text-xs font-bold text-slate-900">
              09:00 – 18:00 WIB
            </p>
          </div>

          {user ? (
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <LogOut size={14} />
              <span>Keluar Akun</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
            >
              <LogIn size={14} />
              <span>Masuk Akun</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1" onClick={onClose} aria-hidden />
    </div>
  );
}
