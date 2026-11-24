import {
  BarChart3,
  BookMarked,
  ChevronRight,
  FileSpreadsheet,
  Wallet,
} from 'lucide-react';

const REPORTS = [
  {
    href: '/dashboard/admin/reports/attendance',
    icon: FileSpreadsheet,
    iconClass: 'bg-blue-600 text-white',
    cardClass: 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-100',
    title: 'Laporan Presensi Kegiatan',
    description: 'Rekap kehadiran + export .xlsx',
  },
  {
    href: '/dashboard/admin/reports/cash',
    icon: Wallet,
    iconClass: 'bg-emerald-600 text-white',
    cardClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-100',
    title: 'Laporan Kas',
    description: 'Donasi, tiket masuk & denda sirkulasi',
  },
  {
    href: '/dashboard/admin/borrowings',
    icon: BookMarked,
    iconClass: 'bg-slate-800 text-white',
    cardClass: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    title: 'Log Peminjaman Buku',
    description: 'Riwayat pinjam per anggota',
  },
] as const;

interface ReportsNavigationCardProps {
  onNavigate: (href: string) => void;
}

export function ReportsNavigationCard({ onNavigate }: ReportsNavigationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2.5">
      <div className="flex items-center gap-2">
        <BarChart3 size={16} className="text-blue-600" />
        <h2 className="font-semibold text-gray-900 text-sm">Laporan &amp; Arsip</h2>
        <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
          Excel Ready
        </span>
      </div>
      <p className="text-[11px] text-slate-500 -mt-1">
        Rekap presensi kegiatan, arus kas, dan log peminjaman buku anggota.
      </p>

      <div className="space-y-2">
        {REPORTS.map((report) => {
          const Icon = report.icon;

          return (
            <button
              key={report.href}
              onClick={() => onNavigate(report.href)}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${report.cardClass}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${report.iconClass}`}
                >
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{report.title}</p>
                  <p className="text-[10px] text-slate-500">{report.description}</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
