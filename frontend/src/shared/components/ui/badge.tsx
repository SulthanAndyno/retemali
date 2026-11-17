import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-ink-soft border-slate-200',
  info: 'bg-surface-blue text-primary-deep border-surface-soft',
  success: 'bg-emerald-50 text-success border-emerald-200',
  warning: 'bg-amber-50 text-[#8a5807] border-amber-200',
  danger: 'bg-red-50 text-danger border-red-200',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
