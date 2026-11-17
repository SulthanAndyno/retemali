'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { Input, Textarea } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { DummyNotice } from '@/shared/components/ui/dummy-notice';
import { DUMMY_SITE_SETTINGS } from '@/features/admin/fixtures/admin-dummy';

export function AdminSettingsPage() {
  const { toast } = useToast();
  const settings = DUMMY_SITE_SETTINGS;

  const notAvailable = () =>
    toast('Endpoint pengaturan website sedang dikerjakan backend.', 'warning');

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Pengaturan Website"
        description="Profil komunitas dan kanal pembayaran."
      />
      <Card className="space-y-4">
        <Input
          id="site-address"
          label="Alamat"
          value={settings.address}
          readOnly
          disabled
        />
        <Input
          id="site-phone"
          label="Telepon"
          value={settings.phone}
          readOnly
          disabled
        />
        <Input
          id="site-email"
          label="Email"
          value={settings.email}
          readOnly
          disabled
        />
        <Input
          id="site-maps"
          label="Google Maps URL"
          value={settings.mapsUrl}
          readOnly
          disabled
        />
        <Input
          id="site-instagram"
          label="Instagram URL"
          value={settings.instagramUrl}
          readOnly
          disabled
        />
        <Textarea
          id="site-instructions"
          label="Instruksi Donasi"
          value={settings.donationInstructions}
          readOnly
          disabled
        />
        <Button variant="secondary" onClick={notAvailable}>
          Simpan Pengaturan
        </Button>
        <DummyNotice />
      </Card>

      <Card className="space-y-2">
        <h3 className="text-sm font-bold text-primary-deep">Kanal Pembayaran</h3>
        <p className="text-sm text-ink-soft">
          CRUD kanal pembayaran admin belum tersedia di backend. Halaman ini akan
          memakai endpoint payment account saat sudah aktif.
        </p>
        <Button variant="secondary" onClick={notAvailable}>
          Kelola Kanal
        </Button>
      </Card>
    </div>
  );
}
