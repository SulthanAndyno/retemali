import { IdCard } from 'lucide-react';
import type { MemberCard as MemberCardData } from '../types/member.types';

interface MemberCardProps {
  member: MemberCardData | null;
  fallback: {
    name?: string;
    memberCode?: string;
    points?: number;
    readingTarget?: number;
  };
}

export function MemberCard({ member, fallback }: MemberCardProps) {
  const name = member?.name ?? fallback.name ?? 'Warga Rete Mali';
  const memberCode = member?.memberCode ?? fallback.memberCode ?? '#RM-2024-0188';
  const points = member?.points ?? fallback.points ?? 120;
  const readingTarget = member?.readingTarget ?? fallback.readingTarget ?? 20;

  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-widest text-blue-200 uppercase font-bold">
            Kartu Anggota Digital
          </p>
          <h2 className="text-lg font-extrabold mt-0.5">{name}</h2>
          <p className="text-xs text-blue-200 font-mono mt-0.5">{memberCode}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
          <IdCard size={22} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
        <div>
          <span className="text-[10px] text-blue-200">Poin Literasi</span>
          <p className="font-extrabold text-sm">{points} Pts</p>
        </div>
        <div>
          <span className="text-[10px] text-blue-200">Target Baca Tahunan</span>
          <p className="font-extrabold text-sm">{readingTarget} Buku</p>
        </div>
      </div>
    </section>
  );
}
