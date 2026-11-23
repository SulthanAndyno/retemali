import {
  ChevronRight,
  HeartHandshake,
  Shield,
  User,
} from 'lucide-react';
import type { User as AuthUser } from '@/features/auth';

interface PortalAccessSectionProps {
  role: AuthUser['role'];
  onAdmin: () => void;
  onOperations: () => void;
  onMember: () => void;
}

export function PortalAccessSection({
  role,
  onAdmin,
  onOperations,
  onMember,
}: PortalAccessSectionProps) {
  return (
    <section className="space-y-2 rounded-2xl border border-blue-100/70 bg-white p-4 shadow-sm md:p-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Akses Dashboard ({role})
      </h3>

      <div
        className={
          role === 'ADMIN'
            ? 'space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0'
            : 'space-y-2'
        }
      >
      {role === 'ADMIN' ? (
        <>
          <button
            onClick={onAdmin}
            className="group flex w-full items-center justify-between rounded-xl bg-indigo-50/60 p-3 text-left transition-colors hover:bg-indigo-100/80"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
                <Shield size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Dashboard Administrator
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pusat kendali 4 KPI, kurasi relawan, sirkulasi, &amp; audit
                </p>
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-slate-400 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </>
      ) : null}

      {role === 'VOLUNTEER' ? (
        <button
          onClick={onOperations}
          className="group flex w-full items-center justify-between rounded-xl bg-teal-50/60 p-3 text-left transition-colors hover:bg-teal-100/80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
              <HeartHandshake size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Meja Operasional Relawan
              </h4>
              <p className="text-[11px] text-slate-500">
                Piket relawan, verifikasi E-Tiket, &amp; donasi
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      ) : null}

      {role === 'MEMBER' || role === 'DONOR' ? (
        <button
          onClick={onMember}
          className="group flex w-full items-center justify-between rounded-xl border border-blue-200/60 bg-blue-50/60 p-3 text-left transition-colors hover:bg-blue-100/80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <User size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Dashboard Member
              </h4>
              <p className="text-[11px] text-slate-500">
                Peminjaman, E-Tiket kegiatan, notifikasi, &amp; profil anggota
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      ) : null}
      </div>
    </section>
  );
}
