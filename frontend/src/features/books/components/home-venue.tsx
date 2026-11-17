import { ExternalLink, MapPin } from 'lucide-react';
import {
  VENUE_ADDRESS,
  VENUE_LANDMARK,
  VENUE_MAPS,
  VENUE_REGION,
} from '../lib/home-constants';
import type { CommunityInfo } from '../types/home.types';

interface HomeVenueProps {
  community: CommunityInfo | null;
}

export function HomeVenue({ community }: HomeVenueProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-xs border border-blue-100/70 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
          <MapPin size={16} />
          <span>Kunjungi Saung Baca</span>
        </div>
        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
          Akses Terbuka
        </span>
      </div>

      <div className="relative h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col items-center justify-center text-center p-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 shadow-sm">
          <MapPin size={16} />
        </div>
        <p className="text-xs font-bold text-slate-800">{VENUE_ADDRESS}</p>
        <p className="text-[10px] text-slate-500">{community?.area ?? VENUE_REGION}</p>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-[11px] text-slate-600">{VENUE_LANDMARK}</span>
        <a
          href={VENUE_MAPS}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
        >
          <span>Buka Peta</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </section>
  );
}
