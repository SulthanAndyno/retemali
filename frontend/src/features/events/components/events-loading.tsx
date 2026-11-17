import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function EventsLoading() {
  return (
    <div className="py-10">
      <LoadingSpinner size="lg" label="Memuat kegiatan..." />
    </div>
  );
}
