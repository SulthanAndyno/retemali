import { Calendar } from 'lucide-react';
import { formatDate, getImageUrl } from '@/lib/utils';
import { isThisWeek, type EventTimeline } from '../lib/events';
import { EVENT_FEE_LABELS } from '../lib/event-options';
import type { EventItem } from '../types/event.types';

interface EventCardBannerProps {
  event: EventItem;
  timeline: EventTimeline;
}

export function EventCardBanner({ event, timeline }: EventCardBannerProps) {
  return (
    <div className="relative h-48 w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 flex flex-col justify-end p-4 text-white overflow-hidden">
      {event.bannerImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getImageUrl(event.bannerImage)}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            {isThisWeek(event.eventDate) ? 'Pekan Ini' : timeline.label}
          </span>
          <span className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            {EVENT_FEE_LABELS[event.feeType]}
          </span>
        </div>

        <p className="text-[11px] text-blue-200 flex items-center gap-1 font-medium mb-1">
          <Calendar size={13} />
          <span>
            {formatDate(event.eventDate)} • {event.startTime} - {event.endTime} WIB
          </span>
        </p>
        <h3 className="text-base font-extrabold leading-snug drop-shadow-xs line-clamp-2">
          {event.title}
        </h3>
      </div>
    </div>
  );
}
