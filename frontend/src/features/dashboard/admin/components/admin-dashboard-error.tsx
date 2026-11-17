import { ErrorMessage } from '@/shared/components/ui/error-message';

interface AdminDashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export function AdminDashboardError({ message, onRetry }: AdminDashboardErrorProps) {
  return (
    <div className="px-4 pt-8">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}
