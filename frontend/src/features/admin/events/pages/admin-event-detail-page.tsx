'use client';

import { useParams } from 'next/navigation';
import { AdminAttendanceDetailPage } from '@/features/admin/attendance/pages/admin-attendance-detail-page';

export function AdminEventDetailPage() {
  const params = useParams<{ id: string }>();
  return <AdminAttendanceDetailPage eventId={params?.id} />;
}
