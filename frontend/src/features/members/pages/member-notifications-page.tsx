import { BellRing } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui/card';
import { NotificationsInbox } from '@/components/notifications/notifications-inbox';

export function MemberNotificationsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Notifikasi"
        description="Status pembayaran, pengumuman taman baca, pengingat kegiatan, dan informasi absensi Anda."
      />
      <Card className="flex items-start gap-3 bg-surface-blue/50">
        <BellRing
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep"
          aria-hidden
        />
        <p className="text-sm text-primary-deep">
          Pemberitahuan penting tentang pendaftaran, verifikasi pembayaran, dan
          jadwal kegiatan diarahkan ke akun Anda (bukan ke tamu tanpa akun).
        </p>
      </Card>
      <NotificationsInbox />
    </div>
  );
}
