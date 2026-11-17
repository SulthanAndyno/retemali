import { AlertTriangle } from 'lucide-react';

interface AutoClosedNoticeProps {
  count: number;
}

export function AutoClosedNotice({ count }: AutoClosedNoticeProps) {
  if (count <= 0) return null;

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 flex items-start gap-2">
      <AlertTriangle size={15} className="text-slate-600 shrink-0 mt-0.5" />
      <p className="text-[11px] text-slate-700 leading-snug">
        <span className="font-bold">{count} kegiatan</span> sudah melewati jadwal selesai dan
        ditutup otomatis oleh sistem. Pendaftaran pada kegiatan tersebut tidak lagi tersedia.
      </p>
    </div>
  );
}
