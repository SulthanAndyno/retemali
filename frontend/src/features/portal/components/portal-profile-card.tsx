import type { User } from '@/features/auth';

export function PortalProfileCard({ user }: { user: User }) {
  return (
    <section className="space-y-3 rounded-2xl border border-blue-100/70 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-base font-extrabold text-white shadow-xs">
          {user.name ? user.name.slice(0, 2).toUpperCase() : 'RM'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-extrabold text-slate-900">
              {user.name}
            </h2>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {user.role}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-xs text-slate-500">
            {user.memberCode}
          </p>
          <p className="truncate text-[11px] text-slate-400">{user.email}</p>
        </div>
      </div>
    </section>
  );
}
