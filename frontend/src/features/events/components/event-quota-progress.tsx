import { AlertCircle } from 'lucide-react';
import {
  TONE_BAR_CLASSES,
  TONE_CLASSES,
  type EventTimeline,
  type QuotaState,
} from '../lib/events';

interface EventQuotaProgressProps {
  timeline: EventTimeline;
  quota: QuotaState;
}

export function EventQuotaProgress({ timeline, quota }: EventQuotaProgressProps) {
  const isClosed = !timeline.isRegistrationOpen;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="text-slate-600">
          {quota.registered} / {quota.quota} peserta terdaftar
        </span>
        <div className="flex items-center gap-1">
          {timeline.isAutoClosed && (
            <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
              Ditutup Otomatis
            </span>
          )}
          <span
            className={`px-1.5 py-0.5 rounded-full font-bold ${
              TONE_CLASSES[quota.tone] ?? 'bg-slate-100 text-slate-600'
            }`}
          >
            {quota.isFull ? 'Kuota Penuh' : `${quota.percent}%`}
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${TONE_BAR_CLASSES[quota.tone] ?? 'bg-slate-400'}`}
          style={{ width: `${quota.percent}%` }}
        />
      </div>
      {isClosed && timeline.closedReason && (
        <p className="text-[10px] text-slate-500 leading-snug flex items-start gap-1">
          <AlertCircle size={11} className="mt-0.5 shrink-0" />
          {timeline.closedReason}
        </p>
      )}
    </div>
  );
}
