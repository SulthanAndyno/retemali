import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function HomeLoading() {
  return (
    <div className="py-10">
      <LoadingSpinner size="lg" label="Memuat beranda..." />
    </div>
  );
}
