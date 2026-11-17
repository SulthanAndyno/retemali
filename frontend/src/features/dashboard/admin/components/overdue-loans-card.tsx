import { BookOpen } from 'lucide-react';
import { getImageUrl } from '@/shared/lib/utils';
import { formatOverdueLoan } from '../lib/admin-format';
import type { OverdueCirculationAlert } from '../types/admin.types';
import { AdminSection } from './admin-section';

interface OverdueLoansCardProps {
  alerts: OverdueCirculationAlert[];
}

export function OverdueLoansCard({ alerts }: OverdueLoansCardProps) {
  const loans = alerts.map((alert) => formatOverdueLoan(alert));

  return (
    <AdminSection
      title="Peringatan Sirkulasi"
      count={loans.length}
      countColor="bg-red-100 text-red-700"
    >
      {loans.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Tidak ada keterlambatan</p>
      ) : (
        loans.map((loan) => (
          <div
            key={loan.id}
            className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
          >
            <div className="w-12 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
              {loan.bookCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(loan.bookCover)}
                  alt={loan.bookTitle}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen size={20} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{loan.bookTitle}</p>
              <p className="text-xs text-gray-500">{loan.borrowerName}</p>
              <span className="inline-block mt-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Lewat {loan.overdueDays} Hari
              </span>
              <p className="text-xs text-gray-400 mt-1">Jatuh tempo: {loan.dueDate}</p>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 text-xs border border-gray-300 text-gray-700 rounded-lg py-1.5 hover:bg-gray-50 transition">
                  Buku Hilang?
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </AdminSection>
  );
}
