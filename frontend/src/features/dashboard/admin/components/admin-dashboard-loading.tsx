import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function AdminDashboardLoading() {
  return (
    <div className="px-4 pt-8">
      <LoadingSpinner size="lg" label="Memuat dashboard admin..." />
    </div>
  );
}
