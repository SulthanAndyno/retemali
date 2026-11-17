import { MapPin } from 'lucide-react';
import { resolveEventState, type ServerEventState } from '../lib/events';
import type { EventItem } from '../types/event.types';
import { EventAdminActions } from './event-admin-actions';
import { EventCardBanner } from './event-card-banner';
import { EventQuotaProgress } from './event-quota-progress';
import { EventRegisterButton } from './event-register-button';

interface EventCardProps {
  event: EventItem;
  autoCloseState?: ServerEventState | null;
  canManage: boolean;
  deleting: boolean;
  registering: boolean;
  onRegister: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventCard({
  event,
  autoCloseState,
  canManage,
  deleting,
  registering,
  onRegister,
  onEdit,
  onDelete,
}: EventCardProps) {
  const { timeline, quota } = resolveEventState(event, autoCloseState);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-blue-100/70 hover:shadow-md transition-shadow">
      <EventCardBanner event={event} timeline={timeline} />

      <div className="p-4 space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          {event.description}
        </p>

        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-600">
            <MapPin size={13} className="text-blue-600" />
            <span>{event.location}</span>
          </div>

          <span className={`font-bold ${quota.isFull ? 'text-rose-600' : 'text-slate-600'}`}>
            • {quota.label}
          </span>
        </div>

        <EventQuotaProgress timeline={timeline} quota={quota} />

        <EventRegisterButton
          event={event}
          timeline={timeline}
          quota={quota}
          registering={registering}
          onRegister={onRegister}
        />

        {canManage && (
          <EventAdminActions deleting={deleting} onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}
