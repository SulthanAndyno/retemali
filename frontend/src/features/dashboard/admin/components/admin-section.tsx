import type { ReactNode } from 'react';

interface AdminSectionProps {
  title: string;
  count: number;
  countColor: string;
  children: ReactNode;
}

export function AdminSection({ title, count, countColor, children }: AdminSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${countColor}`}>
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}
