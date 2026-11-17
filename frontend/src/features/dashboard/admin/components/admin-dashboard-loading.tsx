import LoadingSpinner from '@/components/ui/LoadingSpinner';

export function AdminDashboardLoading() {
  return (
    <div className="px-4 pt-8">
      <LoadingSpinner size="lg" label="Memuat dashboard admin..." />
    </div>
  );
}
