import ErrorMessage from '@/components/ui/ErrorMessage';

interface VolunteerDashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export function VolunteerDashboardError({ message, onRetry }: VolunteerDashboardErrorProps) {
  return (
    <div className="px-4 pt-8">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}
