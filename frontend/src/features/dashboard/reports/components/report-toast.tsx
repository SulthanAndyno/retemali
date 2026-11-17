import type { ReportToastState } from '../hooks/use-report-toast';

interface ReportToastProps {
  toast: ReportToastState;
}

export function ReportToast({ toast }: ReportToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold max-w-[90%] ${
        toast.type === 'success' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'
      }`}
    >
      {toast.message}
    </div>
  );
}
