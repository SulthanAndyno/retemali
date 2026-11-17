import { ArrowLeftRight, BookOpen, Heart, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getDonationTargetPercentage } from '../lib/admin-format';
import type { AdminKpiCards } from '../types/admin.types';
import { AdminKpiCard } from './admin-kpi-card';

interface AdminKpiGridProps {
  kpis: AdminKpiCards;
}

export function AdminKpiGrid({ kpis }: AdminKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <AdminKpiCard
        icon={<BookOpen size={20} className="text-blue-600" />}
        label="Koleksi Buku"
        value={kpis.totalBookUnits.toLocaleString('id-ID')}
        sub={`${kpis.totalBookTitles.toLocaleString('id-ID')} judul buku`}
        subColor="text-emerald-600"
        bg="bg-blue-50"
      />
      <AdminKpiCard
        icon={<Users size={20} className="text-blue-600" />}
        label="Anggota Aktif"
        value={kpis.activeMembersCount.toLocaleString('id-ID')}
        sub="Warga terdaftar aktif"
        subColor="text-emerald-600"
        bg="bg-blue-50"
      />
      <AdminKpiCard
        icon={<ArrowLeftRight size={20} className="text-blue-600" />}
        label="Sirkulasi Pinjam"
        value={kpis.totalCirculationLoans.toLocaleString('id-ID')}
        sub={`${kpis.onTimeReturnPercentage}% tepat waktu`}
        subColor="text-emerald-600"
        bg="bg-blue-50"
      />
      <AdminKpiCard
        icon={<Heart size={20} className="text-yellow-500" />}
        label="Donasi Operasional"
        value={formatCurrency(kpis.collectedDonationAmount)}
        sub={`${getDonationTargetPercentage(
          kpis.collectedDonationAmount,
          kpis.targetDonationAmount
        )}% target rak`}
        subColor="text-yellow-600"
        bg="bg-yellow-50"
      />
    </div>
  );
}
