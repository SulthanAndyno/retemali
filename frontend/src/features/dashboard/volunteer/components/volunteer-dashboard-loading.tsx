import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function VolunteerDashboardLoading() {
  return (
    <div className="px-4 pt-8">
      <LoadingSpinner size="lg" label="Memuat meja relawan..." />
    </div>
  );
}
