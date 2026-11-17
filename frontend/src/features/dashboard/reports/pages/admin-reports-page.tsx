'use client';

import { FileSpreadsheet, Receipt } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';
import { Card, SectionTitle } from '@/components/ui/card';

export function AdminReportsPage() {
  return (
    <div className="space-y-4">
      <SectionTitle
        title="Laporan & Arsip"
        description="Rekap presensi kegiatan dan arus kas."
      />
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-field bg-surface-blue text-primary-deep">
              <FileSpreadsheet className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-primary-deep">Laporan Presensi</p>
              <p className="text-xs text-ink-soft">Kehadiran peserta per kegiatan.</p>
            </div>
          </div>
          <LinkButton href="/admin/laporan/presensi" size="sm" variant="secondary">
            Buka
          </LinkButton>
        </Card>
        <Card className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-field bg-surface-blue text-primary-deep">
              <Receipt className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-primary-deep">Laporan Kas</p>
              <p className="text-xs text-ink-soft">Donasi, infaq, dan denda sirkulasi.</p>
            </div>
          </div>
          <LinkButton href="/admin/laporan/kas" size="sm" variant="secondary">
            Buka
          </LinkButton>
        </Card>
      </div>
    </div>
  );
}
