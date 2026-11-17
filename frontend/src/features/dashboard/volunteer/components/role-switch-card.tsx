'use client';

import { ArrowLeftRight } from 'lucide-react';

interface RoleSwitchCardProps {
  activeRole: string;
  isVolunteerMode: boolean;
  canSwitch: boolean;
  switching: boolean;
  onToggle: () => void;
}

export function RoleSwitchCard({
  activeRole,
  isVolunteerMode,
  canSwitch,
  switching,
  onToggle,
}: RoleSwitchCardProps) {
  if (!canSwitch) return null;

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <ArrowLeftRight size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">Mode Peran</h3>
            <p className="text-[10px] text-slate-500 leading-tight">
              Beralih antara tampilan Anggota dan Relawan.
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isVolunteerMode ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {activeRole}
        </span>
      </div>

      <button
        onClick={onToggle}
        disabled={switching}
        className="w-full py-2 rounded-xl text-[11px] font-bold bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-60 transition-colors"
      >
        {switching
          ? 'Mengalihkan...'
          : isVolunteerMode
            ? 'Keluar dari Mode Relawan'
            : 'Masuk Mode Relawan'}
      </button>
    </section>
  );
}
