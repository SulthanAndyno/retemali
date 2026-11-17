import { ChevronRight, MapPin } from 'lucide-react';
import { formatCurrency, getImageUrl } from '@/shared/lib/utils';
import { formatEventSchedule, getEventSeatsLabel, isWithinDays } from '../lib/home-format';
import type { FeaturedEvent } from '../types/home.types';

interface HomeFeaturedEventProps {
  event: FeaturedEvent | null;
  onViewEvents: () => void;
}

export function HomeFeaturedEvent({ event, onViewEvents }: HomeFeaturedEventProps) {
  if (!event) return null;

  const feeLabel =
    event.feeType === 'FREE' ? 'Gratis' : formatCurrency(Number(event.infaqAmount ?? 0));

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
            Kegiatan Komunitas
          </h3>
          <p className="text-[11px] text-slate-500 leading-tight">
            Ajak adik dan tetangga berkumpul seru
          </p>
        </div>

        <button
          onClick={onViewEvents}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <span>Semua Acara</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-blue-100/80">
        <div className="relative h-44 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-4 flex flex-col justify-end text-white">
          {event.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl(event.bannerImage)}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          ) : null}

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-3">
              {isWithinDays(event.eventDate, 7) ? (
                <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  Pekan Ini
                </span>
              ) : null}
              <span className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                {feeLabel}
              </span>
            </div>

            <p className="text-[11px] text-blue-200 mb-1">
              {formatEventSchedule(event)}
            </p>
            <h4 className="text-base font-extrabold leading-snug drop-shadow-xs">
              {event.title}
            </h4>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-600 flex items-center gap-1">
              <MapPin size={13} className="text-blue-600" /> {event.location}
            </span>
            <span className="font-bold text-rose-600">• {getEventSeatsLabel(event)}</span>
          </div>

          <button
            onClick={onViewEvents}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            {event.feeType === 'FREE' ? 'Daftar Sekarang (Gratis)' : 'Daftar Sekarang'}
          </button>
        </div>
      </div>
    </section>
  );
}
