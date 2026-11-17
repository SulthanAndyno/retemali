import type { ReactNode } from 'react';

interface AdminKpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  subColor: string;
  bg: string;
}

export function AdminKpiCard({
  icon,
  label,
  value,
  sub,
  subColor,
  bg,
}: AdminKpiCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-1">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}
