import { Edit2, Trash2 } from 'lucide-react';

interface EventAdminActionsProps {
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventAdminActions({
  deleting,
  onEdit,
  onDelete,
}: EventAdminActionsProps) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
      <button
        onClick={onEdit}
        className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
      >
        <Edit2 size={13} className="text-blue-600" />
        <span>Edit Kegiatan</span>
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
      >
        <Trash2 size={13} className="text-rose-600" />
        <span>{deleting ? 'Menghapus...' : 'Hapus'}</span>
      </button>
    </div>
  );
}
