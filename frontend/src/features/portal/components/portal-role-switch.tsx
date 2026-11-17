import { ArrowLeftRight } from 'lucide-react';
import type { ActiveRole } from '@/features/auth';

interface PortalRoleSwitchProps {
  activeRole: ActiveRole;
  isVolunteerMode: boolean;
  switching: boolean;
  onToggle: () => void;
}

export function PortalRoleSwitch({
  activeRole,
  isVolunteerMode,
  switching,
  onToggle,
}: PortalRoleSwitchProps) {
  return (
    <section className="space-y-2.5 rounded-2xl border border-blue-100/70 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <ArrowLeftRight size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Mode Peran Aktif
            </h3>
            <p className="text-[10px] text-slate-500">
              Beralih masuk/keluar dari peran Relawan.
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isVolunteerMode
              ? 'bg-teal-100 text-teal-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {activeRole}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2">
        <span
          className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-bold ${
            !isVolunteerMode
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Anggota
        </span>
        <button
          role="switch"
          aria-checked={isVolunteerMode}
          aria-label="Alihkan peran relawan"
          onClick={onToggle}
          disabled={switching}
          className={`relative h-6 w-12 rounded-full transition-colors disabled:opacity-60 ${
            isVolunteerMode ? 'bg-teal-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              isVolunteerMode ? 'left-6' : 'left-0.5'
            }`}
          />
        </button>
        <span
          className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-bold ${
            isVolunteerMode
              ? 'bg-white text-teal-700 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          Relawan
        </span>
      </div>

      {switching ? (
        <p className="text-[10px] text-slate-500">
          Memproses perubahan peran...
        </p>
      ) : null}
    </section>
  );
}
