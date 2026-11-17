import { LinkButton } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';

interface AdminPendingApprovalsProps {
  pendingBookDonations: number;
  pendingVolunteers: number;
  loading: boolean;
}

export function AdminPendingApprovals({
  pendingBookDonations,
  pendingVolunteers,
  loading,
}: AdminPendingApprovalsProps) {
  return (
    <section>
      <SectionTitle
        title="Pengajuan Menunggu Persetujuan"
        description="Donasi buku (drop-off) dan pendaftaran relawan perlu keputusan admin."
      />
      {loading ? (
        <div className="h-24 animate-pulse rounded-card bg-white" />
      ) : pendingBookDonations === 0 && pendingVolunteers === 0 ? (
        <EmptyState title="Tidak ada pengajuan tertunda" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary-deep">
                  Donasi Buku Tertunda
                </h3>
                <p className="text-xs text-ink-soft">
                  {pendingBookDonations} pengajuan menunggu konfirmasi drop-off.
                </p>
              </div>
              <LinkButton href="/admin/donasi" size="sm" variant="secondary">
                Buka
              </LinkButton>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary-deep">
                  Relawan Menunggu Persetujuan
                </h3>
                <p className="text-xs text-ink-soft">
                  {pendingVolunteers} akun menunggu dikaktifkan sebagai relawan.
                </p>
              </div>
              <LinkButton href="/admin/volunteer" size="sm" variant="secondary">
                Buka
              </LinkButton>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
