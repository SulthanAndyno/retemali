import LoadingSpinner from '@/components/ui/LoadingSpinner';

export function HomeLoading() {
  return (
    <div className="py-10">
      <LoadingSpinner size="lg" label="Memuat beranda..." />
    </div>
  );
}
