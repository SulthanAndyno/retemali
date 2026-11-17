import { FileText, UserCheck } from 'lucide-react';
import { getInitials } from '../lib/admin-format';
import type { PendingVolunteerApplication } from '../types/admin.types';
import { AdminSection } from './admin-section';

interface VolunteerApplicationsCardProps {
  applications: PendingVolunteerApplication[];
  pendingId: string | null;
  onApprove: (id: string) => void;
}

export function VolunteerApplicationsCard({
  applications,
  pendingId,
  onApprove,
}: VolunteerApplicationsCardProps) {
  return (
    <AdminSection
      title="Calon Relawan Baru"
      count={applications.length}
      countColor="bg-blue-100 text-blue-700"
    >
      {applications.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Tidak ada pendaftar baru</p>
      ) : (
        applications.map((application) => {
          const pending = pendingId === application.id;

          return (
            <div
              key={application.id}
              className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(application.user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {application.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {application.majorOrJob} · {application.institution}
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {application.division}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-xs border border-blue-500 text-blue-600 rounded-lg py-1.5 hover:bg-blue-50 transition flex items-center justify-center gap-1">
                  <FileText size={12} />
                  Tinjau Berkas
                </button>
                <button
                  onClick={() => onApprove(application.id)}
                  disabled={pending}
                  className="flex-1 text-xs bg-blue-600 text-white rounded-lg py-1.5 hover:bg-blue-700 transition flex items-center justify-center gap-1 disabled:opacity-60"
                >
                  <UserCheck size={12} />
                  {pending ? 'Memproses...' : 'Setujui Relawan'}
                </button>
              </div>
            </div>
          );
        })
      )}
    </AdminSection>
  );
}
