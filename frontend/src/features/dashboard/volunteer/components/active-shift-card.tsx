'use client';

import { Clock, LogIn, LogOut } from 'lucide-react';
import { initials } from '../lib/volunteer-format';
import type { VolunteerShift } from '../types/volunteer.types';

interface ActiveShiftCardProps {
  shiftLabel: string;
  location: string;
  myActiveShift: VolunteerShift | null;
  onDutyVolunteers: VolunteerShift[];
  duration: string;
  isClockedIn: boolean;
  pending: boolean;
  onToggleClock: () => void;
}

export function ActiveShiftCard({
  shiftLabel,
  location,
  myActiveShift,
  onDutyVolunteers,
  duration,
  isClockedIn,
  pending,
  onToggleClock,
}: ActiveShiftCardProps) {
  const shownVolunteers = onDutyVolunteers.slice(0, 2);
  const primaryName = myActiveShift?.user.name ?? 'Belum ada petugas';
  const otherNames = onDutyVolunteers
    .filter((volunteer) => volunteer.id !== myActiveShift?.id)
    .map((volunteer) => volunteer.user.name)
    .join(' & ');

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80">
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{shiftLabel}</span>
        </div>

        <div className="flex items-center gap-1">
          {shownVolunteers.map((volunteer, index) => (
            <span
              key={volunteer.id}
              className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                index === 0
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-sky-100 text-sky-700 -ml-2'
              }`}
            >
              {initials(volunteer.user.name)}
            </span>
          ))}
          <span className="text-[10px] text-slate-500 font-medium ml-1">
            {onDutyVolunteers.length} Bertugas
          </span>
        </div>
      </div>

      <h2 className="text-base font-extrabold text-slate-900 leading-tight">
        Meja Operasional Volunteer
      </h2>
      <p className="text-[11px] text-slate-500 mt-0.5">{location}</p>

      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mt-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800">
            {primaryName}
            {myActiveShift && <span className="text-blue-600 font-semibold"> (Koor)</span>}
            {otherNames && <span> &amp; {otherNames}</span>}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Clock size={13} className="text-blue-600" />
            <span>Durasi:</span>
            <span className="font-mono font-bold text-slate-900">{duration}</span>
          </div>
        </div>

        <button
          onClick={onToggleClock}
          disabled={pending}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-50 ${
            isClockedIn
              ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isClockedIn ? (
            <>
              <LogOut size={13} />
              <span>Clock-Out</span>
            </>
          ) : (
            <>
              <LogIn size={13} />
              <span>Clock-In</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
