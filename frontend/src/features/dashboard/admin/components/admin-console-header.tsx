import { ChevronDown, Download } from 'lucide-react';

export function AdminConsoleHeader() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-1">
        Konsol Administrator
      </p>
      <h1 className="text-lg font-bold text-gray-900 leading-snug">
        Pusat Manajemen &amp; Operasional
      </h1>
      <p className="text-xs text-gray-500 mt-1">
        Pantau sirkulasi, volunteer, donasi, dan aktivitas harian Rete Mali RTO5 RW14.
      </p>
      <div className="flex items-center justify-between mt-3">
        <button className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200">
          Bulan Ini (Mei 2025)
          <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
          <Download size={14} />
          Unduh Laporan
        </button>
      </div>
    </div>
  );
}
