'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import { DUMMY_BROADCASTS } from '@/features/admin/fixtures/admin-dummy';

export function AdminNotificationsPage() {
  const { toast } = useToast();

  const notAvailable = () =>
    toast('Endpoint broadcast notifikasi sedang dikerjakan backend.', 'warning');

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Notifikasi"
        description="Riwayat pengumuman dan broadcast admin."
      />

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-primary-deep">Broadcast Pengumuman</h3>
          <Button size="sm" variant="secondary" onClick={notAvailable}>
            Buat Broadcast
          </Button>
        </div>
        <p className="text-sm text-ink-soft">
          Form broadcast akan aktif setelah endpoint notifikasi persisten tersedia.
        </p>
      </Card>

      <div className="space-y-2">
        {DUMMY_BROADCASTS.map((broadcast) => (
          <Card key={broadcast.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">{broadcast.title}</p>
              <p className="text-xs text-ink-soft">{broadcast.createdAt}</p>
            </div>
            <Badge tone="info">{broadcast.target}</Badge>
          </Card>
        ))}
      </div>
      <DummyNotice />
    </div>
  );
}
