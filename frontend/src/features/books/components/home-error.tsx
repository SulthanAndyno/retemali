import { ErrorMessage } from '@/shared/components/ui/error-message';

interface HomeErrorProps {
  message: string;
  onRetry: () => void;
}

export function HomeError({ message, onRetry }: HomeErrorProps) {
  return (
    <div className="py-8">
      <ErrorMessage message={message} onRetry={onRetry} />
    </div>
  );
}
