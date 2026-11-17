import { Package } from 'lucide-react';
import { DonationItem } from './donation-item';
import type { PendingBookDonation } from '../types/volunteer.types';

interface PendingDonationsCardProps {
  donations: PendingBookDonation[];
  pendingId: string | null;
  onVerify: (id: string) => void;
}

export function PendingDonationsCard({
  donations,
  pendingId,
  onVerify,
}: PendingDonationsCardProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Package size={17} className="text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900">Verifikasi Donasi Masuk</h3>
        </div>
        <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">
          {donations.length}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 -mt-1">
        {donations.length} batch perlu kurasi relawan
      </p>

      {donations.length === 0 ? (
        <p className="text-xs text-slate-500 py-2 text-center">
          Tidak ada donasi menunggu kurasi.
        </p>
      ) : (
        <div className="space-y-2.5">
          {donations.map((donation, index) => (
            <DonationItem
              key={donation.id}
              donation={donation}
              index={index}
              pending={pendingId === donation.id}
              onVerify={onVerify}
            />
          ))}
        </div>
      )}
    </section>
  );
}
