import ErrorMessage from '@/components/ui/ErrorMessage';

interface MemberDashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export function MemberDashboardError({ message, onRetry }: MemberDashboardErrorProps) {
  return (
    <div className="px-4 pt-8">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}
