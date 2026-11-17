import { BookOpen, Users } from 'lucide-react';
import { formatStatCount } from '../lib/home-format';

interface HomeStatsProps {
  totalUnits: number;
  activeMembers: number;
}

export function HomeStats({ totalUnits, activeMembers }: HomeStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-blue-100/70">
      <div className="bg-white/80 rounded-xl p-2.5 border border-blue-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <BookOpen size={17} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            {formatStatCount(totalUnits)}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">Koleksi Buku</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-xl p-2.5 border border-blue-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Users size={17} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            {formatStatCount(activeMembers)}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">Keluarga Anggota</p>
        </div>
      </div>
    </div>
  );
}
