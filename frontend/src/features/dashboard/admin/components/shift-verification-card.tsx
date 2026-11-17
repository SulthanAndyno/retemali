import { CheckCircle, CheckSquare, RefreshCw, Square } from 'lucide-react';
import {
  formatShiftClock,
  formatShiftDuration,
  formatShiftType,
} from '../lib/admin-format';
import type { ShiftHoursVerification } from '../types/admin.types';

interface ShiftVerificationCardProps {
  verification: ShiftHoursVerification;
  pendingId: string | null;
  approvingAll: boolean;
  onApprove: (id: string) => void;
  onApproveAll: () => void;
}

export function ShiftVerificationCard({
  verification,
  pendingId,
  approvingAll,
  onApprove,
  onApproveAll,
}: ShiftVerificationCardProps) {
  const shifts = verification.pendingShifts;
  const pendingCount = shifts.filter((shift) => shift.approvalStatus !== 'APPROVED').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 text-sm">Verifikasi Jam Piket</h2>
          <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
            {pendingCount} Pending
          </span>
        </div>
        <button
          onClick={onApproveAll}
          disabled={approvingAll}
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 disabled:opacity-60"
        >
          {approvingAll ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
          Setujui Semua
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-700">
            {Math.round(verification.completedHoursThisWeek)} jam
          </p>
          <p className="text-xs text-gray-500">Total Jam</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-emerald-700">
            {verification.fulfillmentPercentage}%
          </p>
          <p className="text-xs text-gray-500">Terpenuhi</p>
        </div>
      </div>

      {shifts.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">Tidak ada shift pending</p>
      ) : (
        <div className="space-y-2">
          {shifts.map((shift) => {
            const approved = shift.approvalStatus === 'APPROVED';
            const pending = pendingId === shift.id;

            return (
              <div key={shift.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <button
                  onClick={() => !approved && !pending && onApprove(shift.id)}
                  disabled={approved || pending || approvingAll}
                  className="flex-shrink-0"
                >
                  {approved ? (
                    <CheckSquare size={20} className="text-blue-600" />
                  ) : (
                    <Square size={20} className="text-gray-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{shift.user.name}</p>
                  <p className="text-xs text-gray-500">{formatShiftType(shift.shiftType)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gray-700">
                    {formatShiftDuration(shift.durationHours)} jam
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatShiftClock(shift.clockInAt)} – {formatShiftClock(shift.clockOutAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
