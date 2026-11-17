import { AlertTriangle } from 'lucide-react';

interface BorrowingsErrorProps {
  message: string;
  onRetry: () => void;
}

export function BorrowingsError({ message, onRetry }: BorrowingsErrorProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-2">
      <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-rose-800">{message}</p>
        <button onClick={onRetry} className="mt-2 text-[11px] font-bold text-rose-700 underline">
          Coba lagi
        </button>
      </div>
    </div>
  );
}
