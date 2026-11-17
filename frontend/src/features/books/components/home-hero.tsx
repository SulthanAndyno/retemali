import { BookOpen, Calendar } from 'lucide-react';
import type { CommunityInfo, PublicMetrics } from '../types/home.types';
import { HomeStats } from './home-stats';

interface HomeHeroProps {
  community: CommunityInfo | null;
  metrics: PublicMetrics | null;
  onBrowseCatalog: () => void;
  onViewEvents: () => void;
}

export function HomeHero({
  community,
  metrics,
  onBrowseCatalog,
  onViewEvents,
}: HomeHeroProps) {
  return (
    <section className="bg-gradient-to-b from-blue-100/70 via-sky-50 to-white rounded-3xl p-5 border border-blue-100 shadow-xs relative overflow-hidden">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full border border-blue-100 text-[11px] font-semibold text-slate-700 mb-3 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Buka Hari Ini • {community?.openHours ?? '09:00 - 18:00 WIB'}</span>
        <span className="text-slate-400 font-normal">
          | {community?.area ?? 'RT 05 RW 14 Jatirangga'}
        </span>
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
        Temukan Bacaan Favoritmu di <span className="text-blue-600">Rete Mali</span>
      </h2>

      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
        Ruang literasi hangat warga Betawi Permai. Pinjam buku dengan mudah, ikut kelas kreatif,
        dan tebarkan semangat membaca untuk generasi muda.
      </p>

      <div className="space-y-2 mt-4">
        <button
          onClick={onBrowseCatalog}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen size={16} />
          <span>Jelajahi Katalog</span>
        </button>

        <button
          onClick={onViewEvents}
          className="w-full py-3 bg-sky-100/70 hover:bg-sky-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Calendar size={16} />
          <span>Lihat Kegiatan</span>
        </button>
      </div>

      <HomeStats
        totalUnits={metrics?.totalUnits ?? 0}
        activeMembers={metrics?.activeMembers ?? 0}
      />
    </section>
  );
}
