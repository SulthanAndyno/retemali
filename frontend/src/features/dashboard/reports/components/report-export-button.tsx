import { FileSpreadsheet } from 'lucide-react';

interface ReportExportButtonProps {
  exporting: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function ReportExportButton({
  exporting,
  disabled,
  onClick,
}: ReportExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
    >
      <FileSpreadsheet size={14} />
      {exporting ? 'Menyiapkan berkas...' : 'Export Excel (.xlsx)'}
    </button>
  );
}
