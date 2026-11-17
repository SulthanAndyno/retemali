import LoadingSpinner from '@/components/ui/LoadingSpinner';

export function EventsLoading() {
  return (
    <div className="py-10">
      <LoadingSpinner size="lg" label="Memuat kegiatan..." />
    </div>
  );
}
