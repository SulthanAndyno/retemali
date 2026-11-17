'use client';

import { Check, Inbox, Package } from 'lucide-react';
import { formatWibTime } from '../lib/volunteer-format';
import type { PendingBookDonation } from '../types/volunteer.types';

interface DonationItemProps {
  donation: PendingBookDonation;
  index: number;
  pending: boolean;
  onVerify: (id: string) => void;
}

export function DonationItem({ donation, index, pending, onVerify }: DonationItemProps) {
  const isFirst = index === 0;

  return (
    <div className="bg-blue-50/50 border border-blue-100/80 rounded-xl p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isFirst ? 'bg-blue-100 text-blue-600' : 'bg-sky-100 text-sky-600'
            }`}
          >
            {isFirst ? <Inbox size={15} /> : <Package size={15} />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-900">{donation.donorName}</p>
              {donation.donorBadge && (
                <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                  {donation.donorBadge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600">
              {donation.packageTitle} • {donation.conditionNote}
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400">
          {formatWibTime(donation.createdAt)}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
          Periksa Detail
        </button>
        <button
          onClick={() => onVerify(donation.id)}
          disabled={pending}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 disabled:opacity-50"
        >
          <Check size={12} /> Terima
        </button>
      </div>
    </div>
  );
}
