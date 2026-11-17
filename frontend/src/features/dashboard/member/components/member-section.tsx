import type { ReactNode } from 'react';

interface MemberSectionProps {
  icon: ReactNode;
  title: string;
  badge?: { text: string; className: string };
  children: ReactNode;
}

export function MemberSection({ icon, title, badge, children }: MemberSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100/70 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <h3 className="text-xs font-bold text-slate-900">{title}</h3>
        </div>
        {badge && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
            {badge.text}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}
