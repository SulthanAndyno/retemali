import ErrorMessage from '@/components/ui/ErrorMessage';

interface EventsErrorProps {
  message: string;
  onRetry: () => void;
}

export function EventsError({ message, onRetry }: EventsErrorProps) {
  return (
    <div className="py-8">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}
