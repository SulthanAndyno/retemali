import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { AdminToast as AdminToastItem } from '../hooks/use-admin-toasts';

interface AdminToastProps {
  toasts: AdminToastItem[];
}

export function AdminToast({ toasts }: AdminToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
